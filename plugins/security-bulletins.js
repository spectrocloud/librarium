const { api, callRateLimitAPI } = require("../src/services/security-bulletins");
const { existsSync, mkdirSync } = require("node:fs");
const logger = require("@docusaurus/logger");
const fs = require("fs").promises;
const path = require("path");
const { getFormattedDate } = require("../utils/helpers/date");

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

        const paletteQueryParams = `airgap=false&date=${getFormattedDate()}&edition=palette&report=cve&version=4.4.18`;
        const paletteAirgapQueryParams = `airgap=true&date=${getFormattedDate()}&edition=palette&report=cve&version=4.4.18`;
        const verteXQueryParams = `airgap=false&date=${getFormattedDate()}&edition=vertex&report=cve&version=4.4.18`;
        const verteXAirgapQueryParams = `airgap=true&date=${getFormattedDate()}&edition=vertex&report=cve&version=4.4.18`;

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

      // In here we loop through all the CVEs and create a route for each one.
      // The data for each route is passed as a prop to the component.
      for (const item of uniqueCVEs) {
        const jsonPath = await createData(`${item.cve}.json`, JSON.stringify(item, null, 2));

        const path = `/security-bulletins/reports/${item.cve}`;
        addRoute({
          path: `${path.toLowerCase()}`,
          component: "@site/src/components/CVECard",
          metadata: {
            sourceFilePath: "../docs/docs-content/security-bulletins/reports/reports.mdx",
          },
          modules: {
            cve: jsonPath,
          },
        });
      }
      logger.info("All security bulletin routes generated.");
    },
    async allContentLoaded() {
      logger.success("Security bulletins loaded successfully.");
    },
  };
}

module.exports = {
  pluginSecurityBulletins,
};
