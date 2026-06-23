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
  const limit = 300;
  const maxIterations = 1000;
  const concurrency = 20;

  async function getImageCVEs(pack, imageName, imageTag) {
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
          error.response ? `${error.response.status} - ${JSON.stringify(error.response.data)}` : error.message
        }`
      );

      return null;
    }
  }

  const packsResponse = await callRateLimitAPI(() => api.get("https://dso.teams.spectrocloud.com/v1/packs?images"));

  const packs = packsResponse.data.packs || [];

  const imageJobs = packs.flatMap((pack) => (pack.images || []).map((image) => ({ pack, image })));

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

    // Still emit an (empty) import map so the static import in PacksReadme.tsx resolves.
    await generatePackCVEImportMap();

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
          {
            field: "hasFix",
            operator: "bool",
            value: "true",
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

  await generatePackCVEJsonFiles(GlobalCVEData);
  await generatePackCVEMdxWrappers(GlobalCVEData);
  await generatePackCVEImportMap();
}

async function generatePackCVEJsonFiles(GlobalCVEData) {
  const outputDir = "static/generated/pack-cves";
  mkdirSync(outputDir, { recursive: true });

  const packImages = GlobalCVEData.cves || [];
  const groupedByPackVersion = new Map();

  for (const item of packImages) {
    const version = item.packVersion;
    const key = `${item.pack}@${version}`;

    if (!groupedByPackVersion.has(key)) {
      groupedByPackVersion.set(key, {
        pack: item.pack,
        version,
        images: [],
      });
    }

    groupedByPackVersion.get(key).images.push({
      image: item.image,
      tag: item.tag,
      cves: (item.cves || [])
        .filter((cve) => ["CRITICAL", "HIGH"].includes(cve.severity))
        .sort((a, b) => {
          if (!!a.isImpacting !== !!b.isImpacting) {
            return a.isImpacting ? -1 : 1;
          }

          const severityRank = {
            CRITICAL: 0,
            HIGH: 1,
          };

          const severityDiff = severityRank[a.severity] - severityRank[b.severity];

          if (severityDiff !== 0) {
            return severityDiff;
          }

          return (a.cve || "").localeCompare(b.cve || "");
        })
        .map((cve) => ({
          cve: cve.cve,
          severity: cve.severity,
          package: cve.package || "",
          isImpacting: !!cve.isImpacting,
        })),
    });
  }

  for (const packData of groupedByPackVersion.values()) {
    const fileName = `${packData.pack}-${packData.version}.json`;
    await fs.writeFile(path.join(outputDir, fileName), JSON.stringify(packData, null, 2));
  }

  logger.success("All pack CVE JSON files generated.");
}

async function generatePackCVEMdxWrappers(GlobalCVEData) {
  const outputDir = "src/generated/packs";
  mkdirSync(outputDir, { recursive: true });

  const packImages = GlobalCVEData.cves || [];
  const groupedByPack = new Map();

  for (const item of packImages) {
    const version = item.packVersion;

    if (!groupedByPack.has(item.pack)) {
      groupedByPack.set(item.pack, new Set());
    }

    groupedByPack.get(item.pack).add(version);
  }

  const sortedPacks = [...groupedByPack.entries()].sort(([packA], [packB]) => packA.localeCompare(packB));

  for (const [pack, versionSet] of sortedPacks) {
    const versions = Array.from(versionSet).sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));

    const content = `---
sidebar_label: "${pack}"
title: "CVEs for ${pack}"
description: "CVEs found in images for ${pack}"
sidebar_class_name: "hide-from-sidebar"
hide_table_of_contents: false
toc_max_heading_level: 3
tags: ["security", "packs", "cve"]
---

import PackCVEVersion from "@site/src/components/PackCVEVersion";

:::info

A CVE marked as **Impacting** indicates that the vulnerable package, binary, library, or component is present and actively used within the pack image. These CVEs require review and remediation planning as they may affect running workloads.

CVEs that are not marked as **Impacting** are present in the image but are not currently believed to affect the pack's functionality based on Spectro Cloud's analysis.

:::

{(() => {
  const availableVersions = ${JSON.stringify(versions)};
  const selectedVersion = props.selectedVersion || "";

  if (!selectedVersion || !availableVersions.includes(selectedVersion)) {
    return (
      <p style={{ fontSize: "16px", paddingTop: "8px", paddingBottom: "8px" }}>
        No pack CVEs available for the selected version.
      </p>
    );
  }

  return (
    <PackCVEVersion
      pack="${pack}"
      version={selectedVersion}
    />
  );
})()}
`;

    await fs.writeFile(path.join(outputDir, `${pack}.mdx`), content);
  }

  logger.success("All pack CVE MDX wrapper files generated.");
}

async function generatePackCVEImportMap() {
  const packsDir = "src/generated/packs";
  const outputFile = "src/generated/packCveImports.ts";

  mkdirSync(path.dirname(outputFile), { recursive: true });
  mkdirSync(packsDir, { recursive: true });

  const files = await fs.readdir(packsDir);

  const imports = files
    .filter((file) => file.endsWith(".mdx"))
    .sort()
    .map((file) => {
      const packName = file.replace(/\.mdx$/, "");

      return `  "${packName}": () => import("@site/src/generated/packs/${file}"),`;
    })
    .join("\n");

  const content = `/* AUTO-GENERATED. DO NOT EDIT. */

import type { ComponentType } from "react";

export interface MarkdownFile {
  default: ComponentType<{ selectedVersion?: string }>;
}

export const packCveImports: Record<string, () => Promise<MarkdownFile>> = {
${imports}
};
`;

  await fs.writeFile(outputFile, content);

  logger.success("Generated pack CVE import map.");
}

generateCVEs().catch((error) => {
  logger.error(error);
  logger.error("Error:", error.response ? error.response.status : error.message);
  process.exit(7);
});
