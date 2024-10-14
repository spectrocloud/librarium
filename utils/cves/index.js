const { api, callRateLimitAPI } = require("./requests");
const { existsSync, mkdirSync } = require("node:fs");
const logger = require("@docusaurus/logger");
const fs = require("fs").promises;
const path = require("path");
const { getTodayFormattedDate, formatDateCveDetails } = require("../helpers/date");
const { escapeMDXSpecialChars } = require("../helpers/string");

async function getSecurityBulletins(queryParams) {
  try {
    const response = await callRateLimitAPI(() => api.get(`https://dso.teams.spectrocloud.com/v1/advisories`));
    if (response && response.data) {
      const highAndCritical = response.data.filter(
        (item) => item.metadata.nistSeverity === "HIGH" || item.metadata.nistSeverity === "CRITICAL"
      );
      return highAndCritical;
    }
  } catch (error) {
    logger.error(error);
    logger.error("Error:", error.response ? error.response.status : error.message);
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

    // const paletteQueryParams = `airgap=false&date=${getTodayFormattedDate()}&edition=palette&report=cve&version=4.5.3`;
    // const paletteAirgapQueryParams = `airgap=true&date=${getTodayFormattedDate()}&edition=palette&report=cve&version=4.5.3`;
    // const verteXQueryParams = `airgap=false&date=${getTodayFormattedDate()}&edition=vertex&report=cve&version=4.5.3`;
    // const verteXAirgapQueryParams = `airgap=true&date=${getTodayFormattedDate()}&edition=vertex&report=cve&version=4.5.3`;

    try {
      // const palette = await getSecurityBulletins(paletteQueryParams);
      // const paletteAirgap = await getSecurityBulletins(paletteAirgapQueryParams);
      // const verteX = await getSecurityBulletins(verteXQueryParams);
      // const verteXAirgap = await getSecurityBulletins(verteXAirgapQueryParams);

      const cves = await getSecurityBulletins();

      const palette = cves.filter(
        (item) =>
          item.spec.impact.impactedProducts.palette === true && item.spec.impact.impactedDeployments.connected === true
      );
      const paletteAirgap = cves.filter(
        (item) =>
          item.spec.impact.impactedProducts.palette === true && item.spec.impact.impactedDeployments.airgap === true
      );
      const vertex = cves.filter(
        (item) =>
          item.spec.impact.impactedProducts.vertex === true && item.spec.impact.impactedDeployments.connected === true
      );
      const vertexAirgap = cves.filter(
        (item) =>
          item.spec.impact.impactedProducts.vertex === true && item.spec.impact.impactedDeployments.airgap === true
      );

      // console.log("Length of palette", palette.length);
      // console.log("Length of palette airgap", paletteAirgap.length);
      // console.log("Length of vertex", vertex.length);
      // console.log("Length of vertex airgap", vertexAirgap.length);

      securityBulletins.set("palette", palette);
      securityBulletins.set("paletteAirgap", paletteAirgap);
      securityBulletins.set("vertex", vertex);
      securityBulletins.set("vertexAirgap", vertexAirgap);

      const plainObject = Object.fromEntries(securityBulletins);
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
    if (!seenCVEs.has(item.cve)) {
      seenCVEs.add(item.cve);
      uniqueCVEs.push(item);
    }
  }

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

## Last Update

${formatDateCveDetails(item.metadata.cveLastModifiedTimestamp)}

## NIST Summary

${escapeMDXSpecialChars(item.spec.assessment.justification)}

## CVE Severity

${item.metadata.cvssScore}

## Status

${item.status.state}


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
