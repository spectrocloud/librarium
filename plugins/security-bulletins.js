const { api, callRateLimitAPI } = require("../src/services/security-bulletins");
const { existsSync, mkdirSync } = require("node:fs");
const logger = require("@docusaurus/logger");
const fs = require("fs").promises;
const path = require("path");
const { getTodayFormattedDate, formatDateCveDetails } = require("../utils/helpers/date");

async function getSecurityBulletins(queryParams) {
  try {
    const response = await callRateLimitAPI(() => api.get(`/v1/reports/container?${queryParams}`));
    if (response && response.data) {
      const highAndCritical = response.data.filter(
        (item) => item.baseSeverity === "HIGH" || item.baseSeverity === "CRITICAL"
      );
      return highAndCritical;
    }
  } catch (error) {
    console.error(error);
    logger.error("Error:", error.response ? error.response.status : error.message);
  }
}

async function pluginSecurityBulletins(context, options) {
  let GlobalCVEData = {};

  return {
    name: "plugin-security-bulletins",
    async loadContent() {
      const securityBulletins = new Map();
      const dirname = path.join(".docusaurus", "plugin-security-bulletins", "default");
      const filename = path.join(dirname, "data.json");

      let isFileExists = false;
      if (existsSync(dirname) && existsSync(filename)) {
        isFileExists = true;
        logger.info("Security bulletins JSON file already exists. Skipping fetching.");
        GlobalCVEData = JSON.parse(await fs.readFile(filename, "utf-8"));
      }

      if (!isFileExists) {
        logger.info("Fetching security bulletins...");

        const paletteQueryParams = `airgap=false&date=${getTodayFormattedDate()}&edition=palette&report=cve&version=4.4.18`;
        const paletteAirgapQueryParams = `airgap=true&date=${getTodayFormattedDate()}&edition=palette&report=cve&version=4.4.18`;
        const verteXQueryParams = `airgap=false&date=${getTodayFormattedDate()}&edition=vertex&report=cve&version=4.4.18`;
        const verteXAirgapQueryParams = `airgap=true&date=${getTodayFormattedDate()}&edition=vertex&report=cve&version=4.4.18`;

        try {
          const palette = await getSecurityBulletins(paletteQueryParams);
          const paletteAirgap = await getSecurityBulletins(paletteAirgapQueryParams);
          const verteX = await getSecurityBulletins(verteXQueryParams);
          const verteXAirgap = await getSecurityBulletins(verteXAirgapQueryParams);

          securityBulletins.set("palette", palette);
          securityBulletins.set("paletteAirgap", paletteAirgap);
          securityBulletins.set("vertex", verteX);
          securityBulletins.set("vertexAirgap", verteXAirgap);
        } catch (error) {
          console.error(error);
          logger.error("Error:", error.response ? error.response.status : error.message);
        }

        const plainObject = Object.fromEntries(securityBulletins);
        GlobalCVEData = plainObject;

        logger.info("Finished fetching security bulletins data.");
      }
    },
    async contentLoaded({ content, actions }) {
      const { createData, addRoute } = actions;

      await createData("data.json", JSON.stringify(GlobalCVEData, null, 2));

      // We need to add a route for each CVE. Let's combine all entries into a single array.
      const allCVEs = Object.values(GlobalCVEData).reduce((acc, curr) => acc.concat(curr), []);

      // const uniqueCVEs = allCVEs.filter((item, index, self) => index === self.findIndex((t) => t.cve === item.cve));
      const uniqueCVEs = [];
      const seenCVEs = new Set();

      // remove any duplicate CVEs. If we don't do this, we will have multiple routes for the same CVE. Multiple routes could cause build errors and navigation issues.
      for (const item of allCVEs) {
        if (!seenCVEs.has(item.cve)) {
          seenCVEs.add(item.cve);
          uniqueCVEs.push(item);
        }
      }

      // In here we loop through all the CVEs and create a markdown file for each one.
      // Ideally, we would use the createRoute function to create a route for each CVE.
      // However, the createRoute requires a component to be passed in. If a component is specified, then we loose the sidebar, header, and footer.
      for (const item of uniqueCVEs) {
        // Create an array of promises for markdown generation
        const markdownPromises = uniqueCVEs.map((item) =>
          createCveMarkdown(item, "docs/docs-content/security-bulletins/reports/")
        );

        // Await all markdown files to be written and check results
        const results = await Promise.all(markdownPromises);

        const failedFiles = results.filter((result) => !result.success);

        if (failedFiles.length > 0) {
          logger.error(`Failed to generate the following markdown files:`);
          failedFiles.forEach((failure) => {
            logger.error(`File: ${failure.file}, Error: ${failure.error.message}`);
          });
        }
      }

      logger.info("All security bulletin markdown files generated.");
    },
    async allContentLoaded() {
      logger.success("Security bulletins loaded successfully.");
    },
  };
}

function createCveMarkdown(item, location) {
  const lowerCaseCve = item.cve.toLowerCase();
  const upperCaseCve = item.cve.toUpperCase();

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

${formatDateCveDetails(item.modifiedDateTime)}

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

module.exports = {
  pluginSecurityBulletins,
};
