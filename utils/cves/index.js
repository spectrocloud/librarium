const { api, callRateLimitAPI } = require("./requests");
const { existsSync, mkdirSync } = require("node:fs");
const { logger } = require("@docusaurus/logger");
const fs = require("fs").promises;
const path = require("path");
const { formatDateCveDetails } = require("../helpers/date");
const { escapeMDXSpecialChars } = require("../helpers/string");
const { generateMarkdownTable } = require("../helpers/affected-table");
const { generateRevisionHistory } = require("../helpers/revision-history");

async function getSecurityBulletins(payload) {
  try {
    return await callRateLimitAPI(() => api.post(`https://dso.teams.spectrocloud.com/v1/advisories`, payload));
  } catch (error) {
    logger.error(error);
    logger.error("Error:", error.response ? error.response.data || error.response.status : error.message);
  }
}

async function generateCVEs() {
  let GlobalCVEData = {};

  const securityBulletins = new Map();
  const dirname = path.join(".docusaurus", "security-bulletins", "default");
  const filename = path.join(dirname, "data.json");

  if (process.env.DISABLE_SECURITY_INTEGRATIONS === "true") {
    logger.info("Security integrations are disabled. Skipping generation of security bulletins.");
    if (!existsSync(dirname) || !existsSync(filename)) {
      // Write the security bulletins data to a JSON file
      mkdirSync(dirname, { recursive: true });
      await fs.writeFile(filename, JSON.stringify({}, null, 2));
    }
    return;
  }

  if (existsSync(dirname) && existsSync(filename)) {
    logger.info("Security bulletins JSON file already exists. Skipping fetching.");
    GlobalCVEData = JSON.parse(await fs.readFile(filename, "utf-8"));
  } else {
    logger.info("Fetching security bulletins...");

    try {
      const palette = await getSecurityBulletins({
        filters: [
          {
            field: "metadata.nistSeverity",
            operator: "in",
            options: ["CRITICAL", "HIGH"],
          },
          {
            field: "spec.impact.impactedProducts.palette",
            operator: "ex",
          },
          {
            field: "spec.impact.impactedDeployments.connected",
            operator: "ex",
          },
        ],
      });
      const paletteAirgap = await getSecurityBulletins({
        filters: [
          {
            field: "metadata.nistSeverity",
            operator: "in",
            options: ["CRITICAL", "HIGH"],
          },
          {
            field: "spec.impact.impactedProducts.palette",
            operator: "ex",
          },
          {
            field: "spec.impact.impactedDeployments.airgap",
            operator: "ex",
          },
        ],
      });
      const vertex = await getSecurityBulletins({
        filters: [
          {
            field: "metadata.nistSeverity",
            operator: "in",
            options: ["CRITICAL", "HIGH"],
          },
          {
            field: "spec.impact.impactedProducts.vertex",
            operator: "ex",
          },
          {
            field: "spec.impact.impactedDeployments.connected",
            operator: "ex",
          },
        ],
      });
      const vertexAirgap = await getSecurityBulletins({
        filters: [
          {
            field: "metadata.nistSeverity",
            operator: "in",
            options: ["CRITICAL", "HIGH"],
          },
          {
            field: "spec.impact.impactedProducts.vertex",
            operator: "ex",
          },
          {
            field: "spec.impact.impactedDeployments.airgap",
            operator: "ex",
          },
        ],
      });

      securityBulletins.set("palette", palette);
      securityBulletins.set("paletteAirgap", paletteAirgap);
      securityBulletins.set("vertex", vertex);
      securityBulletins.set("vertexAirgap", vertexAirgap);

      // const plainObject = Object.fromEntries(securityBulletins);
      const plainObject = Object.fromEntries(
        Array.from(securityBulletins.entries()).map(([key, value]) => [key, value.data])
      );
      GlobalCVEData = plainObject;

      // Write the security bulletins data to a JSON file
      mkdirSync(dirname, { recursive: true });
      await fs.writeFile(filename, JSON.stringify(GlobalCVEData, null, 2));

      logger.info("Finished fetching security bulletins data.");
    } catch (error) {
      logger.error(error);
      logger.error("Error:", error.response ? error.response.status : error.message);
    }
  }

  await generateMarkdownForCVEs(GlobalCVEData);
}

async function generateMarkdownForCVEs(GlobalCVEData) {
  const allCVEs = Object.values(GlobalCVEData).reduce((acc, curr) => acc.concat(curr), []);

  // To generate the Impact Product & Versions table we need to track all the instances of the same CVE
  // The following hashmap will store the data for each CVE and aggregate the impact data for each product
  const cveImpactMap = {};

  for (const item of allCVEs) {
    // Let's add the CVE to the map if it doesn't exist
    // We can take all of the values from the first instance of the CVE
    // Future instances will update the values if they are true
    if (!cveImpactMap[item.metadata.cve]) {
      cveImpactMap[item.metadata.cve] = {
        versions: item.spec.impact.impactedVersions,
        impactsPaletteEnterprise: item.spec.impact.impactedProducts.palette,
        impactsPaletteEnterpriseAirgap: item.spec.impact.impactedDeployments.airgap,
        impactsVerteX: item.spec.impact.impactedProducts.vertex,
        impactsVerteXAirgap: item.spec.impact.impactedDeployments.airgap,
      };
    }

    // If the CVE already exists in the map, we need to update the values
    // But only if the value is true. If the value is false, we don't need to update it.
    if (cveImpactMap[item.metadata.cve]) {
      cveImpactMap[item.metadata.cve].versions = [
        ...cveImpactMap[item.metadata.cve].versions,
        ...item.spec.impact.impactedVersions,
      ];

      if (item.spec.impact.impactedProducts.palette) {
        cveImpactMap[item.metadata.cve].impactsPaletteEnterprise = true;
      }

      if (item.spec.impact.impactedDeployments.airgap) {
        cveImpactMap[item.metadata.cve].impactsPaletteEnterpriseAirgap = true;
      }

      if (item.spec.impact.impactedProducts.vertex) {
        cveImpactMap[item.metadata.cve].impactsVerteX = true;
      }

      if (item.spec.impact.impactedDeployments.airgap) {
        cveImpactMap[item.metadata.cve].impactsVerteXAirgap = true;
      }
    }
  }

  const markdownPromises = allCVEs.map((item) =>
    createCveMarkdown(item, cveImpactMap[item.metadata.cve], "docs/docs-content/security-bulletins/reports/")
  );

  const results = await Promise.all(markdownPromises);

  const failedFiles = results.filter((result) => !result.success);

  if (failedFiles.length > 0) {
    logger.error("Failed to generate the following markdown files:");
    failedFiles.forEach((failure) => {
      logger.error(`File: ${failure.file}, Error: ${failure.error.message}`);
    });
  }

  logger.success("All security bulletin markdown files generated.");
}

function createCveMarkdown(item, cveImpactData, location) {
  const upperCaseCve = item.metadata.cve.toUpperCase();
  const revisions = item.spec.revision;
  const uid = item.metadata.uid.toLowerCase();

  // Generate a table of impacted products
  let table = generateMarkdownTable(cveImpactData);
  let revisionHistory = generateRevisionHistory(revisions);

  const content = `---
sidebar_label: "${upperCaseCve}"
title: "${upperCaseCve}"
description: "Lifecycle of ${upperCaseCve}"
sidebar_class_name: "hide-from-sidebar"
hide_table_of_contents: false
toc_max_heading_level: 2
tags: ["security", "cve"]
---

## CVE Details

[${upperCaseCve}](https://nvd.nist.gov/vuln/detail/${upperCaseCve})

## Initial Publication

${formatDateCveDetails(item.metadata.advCreatedTimestamp)}

## Last Update

${formatDateCveDetails(item.metadata.advLastModifiedTimestamp)}

${item.spec.assessment?.thirdParty?.dependentPackage != "" ? `## Third Party Dependency \n\n${item.spec.assessment.thirdParty.dependentPackage}` : "This CVE does not have a third party dependency."}


## NIST CVE Summary

${escapeMDXSpecialChars(item.metadata.summary)}

## CVE Severity

${item.metadata.cvssScore}

## Our Official Summary

${item.spec.assessment.justification ? escapeMDXSpecialChars(item.spec.assessment.justification) : "Investigation is ongoing to determine how this vulnerability affects our products."}

## Status

${item.status.status}

## Affected Products & Versions

${item.spec.impact.isImpacting ? table : "This CVE is non-impacting as the impacting symbol and/or function is not used in the product"}


## Revision History

${revisionHistory ? revisionHistory : "No revision history available."}
`;

  const filePath = path.join(location, `${uid}.md`);

  // Return a promise and include the CVE or file path in the error log
  return fs
    .writeFile(filePath, content)
    .then(() => ({
      success: true,
      file: filePath,
    }))
    .catch((err) => {
      console.error(`Error writing file for ${upperCaseCve} at ${filePath}:`, err);
      return {
        success: false,
        file: filePath,
        error: err,
      };
    });
}

// Call the main function to generate CVEs
generateCVEs();
