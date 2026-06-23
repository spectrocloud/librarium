const { api, callRateLimitAPI } = require("./requests");
const { existsSync, mkdirSync } = require("node:fs");
const { logger } = require("@docusaurus/logger");
const fs = require("fs").promises;
const path = require("path");
const { marked } = require("marked");
const { formatDateCveDetails } = require("../helpers/date");
const { generateMarkdownTable } = require("../helpers/affected-table");
const { generateRevisionHistory } = require("../helpers/revision-history");
const { generateCVEOfficialDetailsUrl } = require("../helpers/urls");
const { generateCVEMap, generateOSK8sMarkdownTable } = require("../helpers/cveHelpers");

// Escape characters that would break out of HTML text/attribute context.
function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Render a report's markdown body into a self-contained, styled HTML page.
// The generated files live under static/ and are served as plain assets, so they
// carry their own minimal styling rather than relying on the Docusaurus theme.
function renderHtmlPage({ title, description, bodyMarkdown }) {
  const body = marked.parse(bodyMarkdown);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="description" content="${escapeHtml(description)}" />
<title>${escapeHtml(title)}</title>
<style>
  :root { color-scheme: light dark; }
  body { max-width: 880px; margin: 2rem auto; padding: 0 1rem; line-height: 1.6;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
  h1 { border-bottom: 1px solid #ddd; padding-bottom: 0.3rem; }
  table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
  th, td { border: 1px solid #ccc; padding: 0.5rem 0.75rem; text-align: left; }
  a { color: #1f7a78; }
  code { background: rgba(135, 131, 120, 0.15); padding: 0.1rem 0.3rem; border-radius: 3px; }
</style>
</head>
<body>
<h1>${escapeHtml(title)}</h1>
${body}
</body>
</html>
`;
}

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

const REPORTS_DIR = "static/generated/security-bulletins/reports/";
const OS_K8S_DIR = "static/generated/security-bulletins/os-k8s/";

async function generateMarkdownForCVEs(GlobalCVEData) {
  const allCVEs = Object.values(GlobalCVEData).reduce((acc, curr) => acc.concat(curr), []);
  // To generate the Impact Product & Versions table we need to track all the instances of the same CVE
  // The following hashmap will store the data for each CVE and aggregate the impact data for each product
  const cveImpactMap = generateCVEMap(allCVEs);

  // These output directories are git-ignored generated assets, so they may not exist on a
  // fresh checkout. fs.writeFile does not create parent directories, so create them upfront
  // to avoid every report write failing with ENOENT.
  mkdirSync(REPORTS_DIR, { recursive: true });
  mkdirSync(OS_K8S_DIR, { recursive: true });

  const markdownPromises = allCVEs.map((item) => {
    if (item.kind === "os") {
      // If the CVE is related to OS-K8s, use the OS-K8s specific markdown function
      return generateOSK8sMarkdown(item, OS_K8S_DIR);
    } else {
      // Otherwise, use the standard CVE markdown function
      return createCveMarkdown(item, cveImpactMap[item.metadata.cve], REPORTS_DIR);
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

  const bodyMarkdown = `This page provides a listing of vulnerabilities found in the image **${imageName}**.

## Overview

- **Summary**: ${escapeHtml(summary)}
- **Initial Notice Published**: ${createdTimestamp}
- **Last Updated**: ${lastModified}

## Linked Vulnerabilities

${vulnerabilitiesTable}

## Revision History

${generateRevisionHistory(item.spec.revision)}
`;

  const content = renderHtmlPage({
    title: `Security Notice for ${imageName}`,
    description: summary,
    bodyMarkdown,
  });

  const filePath = path.join(location, `${imageName}.html`);

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

  const bodyMarkdown = `## CVE Details

Visit the official vulnerability details page for [${upperCaseCve}](${generateCVEOfficialDetailsUrl(item.metadata.cve)}) to learn more.

## Initial Publication

${formatDateCveDetails(item.metadata.advCreatedTimestamp)}

## Last Update

${formatDateCveDetails(item.metadata.advLastModifiedTimestamp)}

${item.spec.assessment?.thirdParty?.dependentPackage != "" ? `## Third Party Dependency \n\n${escapeHtml(item.spec.assessment.thirdParty.dependentPackage)}` : "This CVE does not have a third party dependency."}


## NIST CVE Summary

${escapeHtml(item.metadata.summary || "")}

## CVE Severity

[${item.metadata.cvssScore}](${generateCVEOfficialDetailsUrl(item.metadata.cve)})

## Our Official Summary

${item.spec.assessment.justification ? escapeHtml(item.spec.assessment.justification) : "Investigation is ongoing to determine how this vulnerability affects our products."}

## Status

${item.status.status}

## Affected Products & Versions

${item.spec.impact.isImpacting ? table : "This CVE is non-impacting as the impacting symbol and/or function is not used in the product"}


## Revision History

${revisionHistory ? revisionHistory : "No revision history available."}
`;

  const content = renderHtmlPage({
    title: upperCaseCve,
    description: `Lifecycle of ${upperCaseCve}`,
    bodyMarkdown,
  });

  const filePath = path.join(location, `${uid}.html`);

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
