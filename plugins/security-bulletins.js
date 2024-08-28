const { api, callRateLimitAPI } = require("../src/services/security-bulletins");
const { open, writeFile, close, existsSync, mkdirSync } = require("node:fs");
const logger = require("@docusaurus/logger");
const fs = require("fs").promises;
const path = require("path");
const { getFormattedDate } = require("../utils/helpers/date");

async function getSecurityBulletins(queryParams) {
  try {
    const response = await callRateLimitAPI(() => api.get(`/v1/reports/cve?${queryParams}`));
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
      const dirname = path.join("static", "data", "security-bulletins");
      const filename = path.join(dirname, "security-bulletins.json");

      let isFileExists = false;
      if (existsSync(dirname) && existsSync(filename)) {
        isFileExists = true;
        logger.info("Security bulletins JSON file already exists. Skipping fetching.");
      }

      if (!isFileExists) {
        logger.info("Fetching security bulletins...");
        const paletteQueryParams = `airgap=false&date=${getFormattedDate()}&edition=palette&report=cve&version=4.4.14`;
        const paletteAirgapQueryParams = `airgap=true&date=${getFormattedDate()}&edition=palette&report=cve&version=4.4.14`;
        const verteXQueryParams = `airgap=false&date=${getFormattedDate()}&edition=vertex&report=cve&version=4.4.14`;
        const verteXAirgapQueryParams = `airgap=true&date=${getFormattedDate()}&edition=vertex&report=cve&version=4.4.14`;

        try {
          const palette = await getSecurityBulletins(paletteQueryParams);
          const paletteAirgap = await getSecurityBulletins(paletteAirgapQueryParams);
          const verteX = await getSecurityBulletins(verteXQueryParams);
          const verteXAirgap = await getSecurityBulletins(verteXAirgapQueryParams);

          securityBulletins.set("palette", palette);
          securityBulletins.set("palette-airgap", paletteAirgap);
          securityBulletins.set("vertex", verteX);
          securityBulletins.set("vertex-airgap", verteXAirgap);
        } catch (error) {
          console.error(error);
          logger.error("Error:", error.response ? error.response.status : error.message);
        }

        if (!existsSync(dirname)) {
          mkdirSync(dirname, { recursive: true });
        }

        try {
          await fs.mkdir(dirname, { recursive: true });

          const plainObject = Object.fromEntries(securityBulletins);
          const jsonString = JSON.stringify(plainObject, null, 2);

          await fs.writeFile(filename, jsonString, "utf8");
          logger.info("Successfully wrote security bulletins to JSON file.");
        } catch (err) {
          logger.error("An error occurred while writing the JSON file:", err);
        }

        logger.success("Finished fetching security bulletins and writing to JSON file.");
      }
    },
  };
}

module.exports = {
  pluginSecurityBulletins,
};
