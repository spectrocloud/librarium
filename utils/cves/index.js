const { api, callRateLimitAPI } = require("./requests");
const { existsSync, mkdirSync } = require("node:fs");
const { logger } = require("@docusaurus/logger");
const fs = require("fs").promises;
const path = require("path");
const { formatDateCveDetails } = require("../helpers/date");
const { escapeMDXSpecialChars } = require("../helpers/string");
const { generateMarkdownTable } = require("../helpers/affected-table");
const { generateRevisionHistory } = require("../helpers/revision-history");
const { generateCVEOfficialDetailsUrl } = require("../helpers/urls");
const { generateCVEMap, generateOSK8sMarkdownTable } = require("../helpers/cveHelpers");

async function getSecurityBulletins(payload) {
  const limit = 300;
  const maxIterations = 1000;
  let results = [];

  try {
    let request = await callRateLimitAPI(() =>
      api.post(`https://dso.teams.spectrocloud.com/v1/advisories?limit=${limit}`, payload)
    );
    results = request.data.advisories;
    let iteration = 0;
    while (request.data.continue && iteration < maxIterations) {
      iteration++;
      request = await callRateLimitAPI(() =>
        api.post(
          `https://dso.teams.spectrocloud.com/v1/advisories?${limit}&offset=${request.data.offset + limit}`,
          payload
        )
      );
      results = results.concat(request.data.advisories);
    }

    if (iteration === maxIterations) {
      logger.warn("Max iterations reached. Verify the API response is setting the continue flag correctly.");
    }

    return { data: results };
  } catch (error) {
    logger.error("Error:", error.response ? `${error.response.status} - ${error.response.data}` : error.message);
    // Return exit code 7 to indicate that the script failed to fetch the security bulletins for GitHub Actions
    process.exit(7);
  }
}

// This function filters the items by UID and returns only the items that start with the keyword, such as "PA-", "VA-", etc.
function filterByUID(items, keyword) {
  if (!Array.isArray(items)) {
    throw new Error("Input must be an array of objects");
  }

  return items.filter((item) => {
    if (!item.metadata || typeof item.metadata.uid !== "string") {
      console.warn("Skipping item due to missing or invalid metadata.uid:", item);
      return false;
    }
    return item.metadata.uid.startsWith(keyword);
  });
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
            field: "metadata.shouldPublish",
            operator: "bool",
            value: "true",
          },
          {
            field: "spec.impact.impactedProducts.palette",
            operator: "ex",
          },
          {
            field: "spec.impact.impactedDeployments.connected",
            operator: "ex",
          },
          {
            field: "status.state",
            options: ["Analyzed", "Modified", "Awaiting Analyses", "Reopened", "Resolved"],
            operator: "in",
          },
        ],
      });
      const paletteAirgap = await getSecurityBulletins({
        filters: [
          {
            field: "metadata.shouldPublish",
            operator: "bool",
            value: "true",
          },
          {
            field: "spec.impact.impactedProducts.palette",
            operator: "ex",
          },
          {
            field: "spec.impact.impactedDeployments.airgap",
            operator: "ex",
          },
          {
            field: "status.state",
            options: ["Analyzed", "Modified", "Awaiting Analyses", "Reopened", "Resolved"],
            operator: "in",
          },
        ],
      });
      const vertex = await getSecurityBulletins({
        filters: [
          {
            field: "metadata.shouldPublish",
            operator: "bool",
            value: "true",
          },
          {
            field: "spec.impact.impactedProducts.vertex",
            operator: "ex",
          },
          {
            field: "spec.impact.impactedDeployments.connected",
            operator: "ex",
          },
          {
            field: "status.state",
            options: ["Analyzed", "Modified", "Awaiting Analyses", "Reopened", "Resolved"],
            operator: "in",
          },
        ],
      });
      const vertexAirgap = await getSecurityBulletins({
        filters: [
          {
            field: "metadata.shouldPublish",
            operator: "bool",
            value: "true",
          },
          {
            field: "spec.impact.impactedProducts.vertex",
            operator: "ex",
          },
          {
            field: "spec.impact.impactedDeployments.airgap",
            operator: "ex",
          },
          {
            field: "status.state",
            options: ["Analyzed", "Modified", "Awaiting Analyses", "Reopened", "Resolved"],
            operator: "in",
          },
        ],
      });

      // Fetching CVEs for OS-K8s images (kind: "os")
      const osK8sImages = await getSecurityBulletins({
        filters: [
          {
            field: "kind",
            operator: "eq",
            value: "os",
          }, // Filtering for OS-K8s images
          {
            field: "metadata.shouldPublish",
            operator: "bool",
            value: "true",
          },
        ],
      });

      // There is no way to filter by product in the API, so we need to filter the results manually to get a list of CVEs for each product
      const filterdPalette = filterByUID(palette.data, "PC-");
      const filterdPaletteAirgap = filterByUID(paletteAirgap.data, "PA-");
      const filterdVertex = filterByUID(vertex.data, "VC-");
      const filterdVertexAirgap = filterByUID(vertexAirgap.data, "VA-");

      securityBulletins.set("palette", filterdPalette);
      securityBulletins.set("paletteAirgap", filterdPaletteAirgap);
      securityBulletins.set("vertex", filterdVertex);
      securityBulletins.set("vertexAirgap", filterdVertexAirgap);
      securityBulletins.set("provider", osK8sImages.data);

      const plainObject = Object.fromEntries(
        Array.from(securityBulletins.entries()).map(([key, value]) => [key, value])
      );
      GlobalCVEData = plainObject;

      // Write the security bulletins data to a JSON file
      mkdirSync(dirname, { recursive: true });
      await fs.writeFile(filename, JSON.stringify(GlobalCVEData, null, 2));

      logger.info("Finished fetching security bulletins data.");
    } catch (error) {
      logger.error(error);
      logger.error("Error:", error.response ? error.response.status : error.message);
      // Return exit code 7 to indicate that the script failed to fetch the security bulletins for GitHub Actions
      process.exit(7);
    }
  }

  await generateMarkdownForCVEs(GlobalCVEData);
}

async function generateMarkdownForCVEs(GlobalCVEData) {
  const allCVEs = Object.values(GlobalCVEData).reduce((acc, curr) => acc.concat(curr), []);
  // To generate the Impact Product & Versions table we need to track all the instances of the same CVE
  // The following hashmap will store the data for each CVE and aggregate the impact data for each product
  const cveImpactMap = generateCVEMap(allCVEs);
  console.log(cveImpactMap);

  const markdownPromises = allCVEs.map((item) => {
    if (item.kind === "os") {
      // If the CVE is related to OS-K8s, use the OS-K8s specific markdown function
      return generateOSK8sMarkdown(item, "docs/docs-content/security-bulletins/os-k8s/");
    } else {
      // Otherwise, use the standard CVE markdown function
      return createCveMarkdown(item, cveImpactMap[item.metadata.cve], "docs/docs-content/security-bulletins/reports/");
    }
  });

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

// Create the markdown file for CVEs grouped by OS-K8s images
async function generateOSK8sMarkdown(item, location) {
  const imageName = item.metadata.uid; // OS-K8s Image Name
  const summary = item.metadata.summary || "No summary available.";
  const lastModified = formatDateCveDetails(item.metadata.advLastModifiedTimestamp);
  const createdTimestamp = formatDateCveDetails(item.metadata.advCreatedTimestamp);

  // Generate a table of linked vulnerabilities
  const vulnerabilitiesTable = generateOSK8sMarkdownTable(item.spec.linkedVulnerabilities);

  const content = `---
sidebar_label: "${imageName}"
title: "Security Notice for ${imageName}"
description: "${summary}"
sidebar_class_name: "hide-from-sidebar"
hide_table_of_contents: false
toc_max_heading_level: 2
tags: ["security", "os-k8s", "cve"]
---

This page provides a listing of vulnerabilities found in the image **${imageName}**.

## Overview

- **Summary**: ${summary}
- **Initial Notice Published**: ${createdTimestamp}
- **Last Updated**: ${lastModified}

## Linked Vulnerabilities

<div class="auto-generated-os-linked-table">

${vulnerabilitiesTable}

</div>

## Revision History

${generateRevisionHistory(item.spec.revision)}
`;

  const filePath = path.join(location, `${imageName}.mdx`);

  return fs
    .writeFile(filePath, content)
    .then(() => ({
      success: true,
      file: filePath,
    }))
    .catch((err) => {
      console.error(`Error writing file for ${imageName} at ${filePath}:`, err);
      return {
        success: false,
        file: filePath,
        error: err,
      };
    });
}
// Create the markdown file for individual CVEs
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

Visit the official vulnerability details page for [${upperCaseCve}](${generateCVEOfficialDetailsUrl(item.metadata.cve)}) to learn more.

## Initial Publication

${formatDateCveDetails(item.metadata.advCreatedTimestamp)}

## Last Update

${formatDateCveDetails(item.metadata.advLastModifiedTimestamp)}

${item.spec.assessment?.thirdParty?.dependentPackage != "" ? `## Third Party Dependency \n\n${item.spec.assessment.thirdParty.dependentPackage}` : "This CVE does not have a third party dependency."}


## NIST CVE Summary

${escapeMDXSpecialChars(item.metadata.summary)}

## CVE Severity

[${item.metadata.cvssScore}](${generateCVEOfficialDetailsUrl(item.metadata.cve)})

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

try {
  generateCVEs();
} catch (error) {
  process.exit(7);
}
