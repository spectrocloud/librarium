const { api, callRateLimitAPI } = require("./requests");
const { existsSync, mkdirSync } = require("node:fs");
const { logger } = require("@docusaurus/logger");
const fs = require("fs").promises;
const path = require("path");

async function runWithConcurrency(items, concurrency, handler) {
  const results = [];
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const currentIndex = index++;
      results[currentIndex] = await handler(items[currentIndex]);
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));

  return results;
}

async function getPackCVEs(payload) {
  const limit = 100;
  const maxIterations = 1000;
  const concurrency = 20;

  async function getImageCVEs(pack, imageName, imageTag) {
    logger.info(`Fetching CVEs for ${imageName}:${imageTag} from pack ${pack.name}...`);

    let results = [];
    let offset = 0;
    let iteration = 0;

    try {
      let request = await callRateLimitAPI(() =>
        api.post(
          `https://dso.teams.spectrocloud.com/v1/images/cves?name=${encodeURIComponent(
            imageName
          )}&tag=${encodeURIComponent(imageTag)}&limit=${limit}&offset=${offset}`,
          payload
        )
      );

      results = results.concat(request.data.cves || []);

      while (request.data.continue && iteration < maxIterations) {
        iteration++;
        offset += limit;

        request = await callRateLimitAPI(() =>
          api.post(
            `https://dso.teams.spectrocloud.com/v1/images/cves?name=${encodeURIComponent(
              imageName
            )}&tag=${encodeURIComponent(imageTag)}&limit=${limit}&offset=${offset}`,
            payload
          )
        );

        results = results.concat(request.data.cves || []);
      }

      return {
        pack: pack.name,
        packVersion: pack.version,
        image: imageName,
        tag: imageTag,
        cves: results,
      };
    } catch (error) {
      logger.warn(
        `Failed to fetch CVEs for ${imageName}:${imageTag}: ${
          error.response
            ? `${error.response.status} - ${JSON.stringify(error.response.data)}`
            : error.message
        }`
      );

      return null;
    }
  }

  const packsResponse = await callRateLimitAPI(() =>
    api.get("https://dso.teams.spectrocloud.com/v1/packs?images")
  );

  const packs = packsResponse.data.packs || [];

  const imageJobs = packs.flatMap((pack) =>
    (pack.images || []).map((image) => ({ pack, image }))
  );

  const results = (
    await runWithConcurrency(imageJobs, concurrency, async ({ pack, image }) => {
      const lastColon = image.lastIndexOf(":");

      if (lastColon === -1) {
        logger.warn(`Skipping malformed image: ${image}`);
        return null;
      }

      const imageName = image.substring(0, lastColon);
      const imageTag = image.substring(lastColon + 1);

      return getImageCVEs(pack, imageName, imageTag);
    })
  ).filter(Boolean);

  return { data: results };
}

async function generateCVEs() {
  let GlobalCVEData = {};

  const packCVEs = new Map();
  const dirname = path.join(".docusaurus", "pack-cves", "default");
  const filename = path.join(dirname, "data.json");

  if (process.env.DISABLE_SECURITY_INTEGRATIONS === "true") {
    logger.info("Security integrations are disabled. Skipping generation of pack CVEs.");

    if (!existsSync(dirname) || !existsSync(filename)) {
      mkdirSync(dirname, { recursive: true });
      await fs.writeFile(filename, JSON.stringify({}, null, 2));
    }

    return;
  }

  if (existsSync(dirname) && existsSync(filename)) {
    logger.info("Pack CVEs JSON file already exists. Skipping fetching.");
    GlobalCVEData = JSON.parse(await fs.readFile(filename, "utf-8"));
  } else {
    logger.info("Fetching pack CVEs...");

    const cves = await getPackCVEs({
      cveFilters: {
        filters: [
          {
            field: "severity",
            operator: "in",
            options: ["CRITICAL", "HIGH"],
          },
        ],
      },
    });

    packCVEs.set("cves", cves.data);

    GlobalCVEData = Object.fromEntries(packCVEs.entries());

    mkdirSync(dirname, { recursive: true });
    await fs.writeFile(filename, JSON.stringify(GlobalCVEData, null, 2));

    logger.info("Finished fetching pack CVEs data.");
  }

  await generateMarkdownForPackCVEs(GlobalCVEData);
}

async function generateMarkdownForPackCVEs(GlobalCVEData) {
  const outputDir = "docs/docs-content/security-bulletins/pack-cves";
  mkdirSync(outputDir, { recursive: true });

  const packImages = GlobalCVEData.cves || [];

  const groupedByPack = new Map();

  for (const item of packImages) {
    const packKey = `${item.pack}@${item.packVersion}`;

    if (!groupedByPack.has(packKey)) {
      groupedByPack.set(packKey, {
        pack: item.pack,
        packVersion: item.packVersion,
        images: [],
      });
    }

    groupedByPack.get(packKey).images.push(item);
  }

  for (const packData of groupedByPack.values()) {
    const content = `---
sidebar_label: "${packData.pack} ${packData.packVersion}"
title: "CVEs for ${packData.pack} ${packData.packVersion}"
description: "CVEs found in images for ${packData.pack} ${packData.packVersion}"
sidebar_class_name: "hide-from-sidebar"
hide_table_of_contents: false
toc_max_heading_level: 3
tags: ["security", "packs", "cve"]
---

# CVEs for ${packData.pack} ${packData.packVersion}

${packData.images
  .map((imageData) => {
    const rows = (imageData.cves || [])
      // Only HIGH and CRITICAL
      .filter((cve) => ["CRITICAL", "HIGH"].includes(cve.severity))
      // Impacting first, then CRITICAL before HIGH, then CVE ID
      .sort((a, b) => {
        if (!!a.isImpacting !== !!b.isImpacting) {
          return a.isImpacting ? -1 : 1;
        }

        const severityRank = {
          CRITICAL: 0,
          HIGH: 1,
        };

        const severityDiff =
          severityRank[a.severity] - severityRank[b.severity];

        if (severityDiff !== 0) {
          return severityDiff;
        }

        return (a.cve || "").localeCompare(b.cve || "");
      })
      .map((cve) => {
        return `| ${cve.cve} | ${cve.severity || ""} | \`${cve.package || ""}\` | ${cve.hasFix ? "Yes" : "No"} | ${cve.isImpacting ? "Yes" : "No"} |`;
      })
      .join("\n");

    return `## ${imageData.image}:${imageData.tag}

| CVE | Severity | Package | Has Fix | Impacting |
| --- | --- | --- | --- | --- |
${rows || "| No HIGH/CRITICAL CVEs found | | | | |"}
`;
  })
  .join("\n")}`;

    const fileName = `${packData.pack}-${packData.packVersion}.mdx`;

    await fs.writeFile(path.join(outputDir, fileName), content);
  }

  logger.success("All pack CVE markdown files generated.");
}

generateCVEs().catch((error) => {
  logger.error(error);
  logger.error("Error:", error.response ? error.response.status : error.message);
  process.exit(7);
});