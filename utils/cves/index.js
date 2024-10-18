const { api, callRateLimitAPI } = require("./requests");
const { existsSync, mkdirSync } = require("node:fs");
const logger = require("@docusaurus/logger");
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
  const uniqueCVEs = [];
  const seenCVEs = new Set();

  // Remove duplicate CVEs
  for (const item of allCVEs) {
    if (!seenCVEs.has(item.metadata.cve)) {
      seenCVEs.add(item.metadata.cve);
      uniqueCVEs.push(item);
    }
  }

  logger.info(`Generating markdown files for ${uniqueCVEs.length} unique CVEs.`);

  const markdownPromises = uniqueCVEs.map((item) =>
    createCveMarkdown(item, "docs/docs-content/security-bulletins/reports/")
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

function createCveMarkdown(item, location) {
  const lowerCaseCve = item.metadata.cve.toLowerCase();
  const upperCaseCve = item.metadata.cve.toUpperCase();

  const impactedProducts = item.spec.impact.impactedProducts;
  const impactedVersions = item.spec.impact.impactedVersions;
  const impactedDeployments = item.spec.impact.impactedDeployments;
  const revisions = item.spec.revision;

  // Generate a table of impacted products

  let productMap = { palette: "Palette Enterprise", vertex: "VerteX" };
  let table = generateMarkdownTable(impactedProducts, impactedVersions, productMap, impactedDeployments);
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

## NIST CVE Summary

${escapeMDXSpecialChars(item.metadata.summary)}

## CVE Severity

${item.metadata.cvssScore}

## Our Official Summary

${item.spec.assessment.justification ? escapeMDXSpecialChars(item.spec.assessment.justification) : "Investigation is ongoing to determine how this vulnerability affects our products."}

## Status

${item.status.state}

## Affected Products & Versions

${item.spec.impact.isImpacting ? table : "This CVE is non-impacting as the impacting symbol and/or function is not used in the product"}


## Revision History

${revisionHistory}




`;

  const filePath = path.join(location, `${lowerCaseCve}.md`);

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
