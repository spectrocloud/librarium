const { api, callRateLimitAPI } = require("../src/services/security-bulletins");
const { existsSync, mkdirSync } = require("node:fs");
const logger = require("@docusaurus/logger");
const fs = require("fs").promises;
const path = require("path");
const { getFormattedDate } = require("../utils/helpers/date");

let GlobalCVEData = "";

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
  return {
    name: "security-bulletins",
    async loadContent() {
      const securityBulletins = new Map();
      const dirname = path.join(".docusaurus", "security-bulletins", "default");
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

        logger.success("Finished fetching security bulletins.");
      }
    },
    async contentLoaded({ content, actions }) {
      const { createData, addRoute } = actions;

      // const friends = ["Yangshun", "Sebastien"];
      // const friendsJsonPath = await createData("friends.json", JSON.stringify(friends));
      const cvesData = await createData("data.json", JSON.stringify(GlobalCVEData, null, 2));

      addRoute({
        path: "/security-bulletins/reports",
        component: "@site/src/components/CveReportsTable",
        modules: {
          cves: cvesData,
        },
        metadata: {
          sourceFilePath: "../docs/docs-content/security-bulletins/reports/reports.mdx",
        },
        exact: false,
      });
    },
  };
}

module.exports = {
  pluginSecurityBulletins,
};
