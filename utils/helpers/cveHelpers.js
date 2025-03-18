// generates a map of CVEs. Each CVE entry contains information about the impact of the CVE on different products and versions.
function generateCVEMap(cveData) {
  const cveImpactMap = {};

  for (const item of cveData) {
    // Let's create a CVE entry in the map if it doesn't exist.
    // By default, let's initailize all values to false or empty array.
    if (!cveImpactMap[item.metadata.cve]) {
      cveImpactMap[item.metadata.cve] = {
        palette: {
          impacts: false,
          versions: [],
        },
        paletteAirgap: {
          impacts: false,
          versions: [],
        },
        vertex: {
          impacts: false,
          versions: [],
        },
        vertexAirgap: {
          impacts: false,
          versions: [],
        },
      };
    }

    // Palette Enterprise logic
    if (item.spec.impact.impactedProducts.palette && !item.spec.impact.impactedDeployments.airgap) {
      cveImpactMap[item.metadata.cve].palette.impacts = true;
      cveImpactMap[item.metadata.cve].palette.versions = item.spec.impact.impactedVersions;
    }

    // Palette Enterprise Airgap logic
    if (item.spec.impact.impactedProducts.palette && item.spec.impact.impactedDeployments.airgap) {
      cveImpactMap[item.metadata.cve].paletteAirgap.impacts = true;
      cveImpactMap[item.metadata.cve].paletteAirgap.versions = item.spec.impact.impactedVersions;
    }

    // Palette VerteX logic
    if (item.spec.impact.impactedProducts.vertex && !item.spec.impact.impactedDeployments.airgap) {
      cveImpactMap[item.metadata.cve].vertex.impacts = true;
      cveImpactMap[item.metadata.cve].vertex.versions = item.spec.impact.impactedVersions;
    }

    // Palette VerteX Airgap logic
    if (item.spec.impact.impactedProducts.vertex && item.spec.impact.impactedDeployments.airgap) {
      cveImpactMap[item.metadata.cve].vertexAirgap.impacts = true;
      cveImpactMap[item.metadata.cve].vertexAirgap.versions = item.spec.impact.impactedVersions;
    }
  }

  return cveImpactMap;
}

// **Helper Function: Generate Markdown Table for Linked Vulnerabilities**
function generateOSK8sMarkdownTable(linkedVulnerabilities) {
  if (!linkedVulnerabilities || linkedVulnerabilities.length === 0) {
    return "No linked vulnerabilities found.";
  }

  let table = `| CVE ID | Package | Installed Version | Severity | Status | NIST Link |
|--------|---------|-------------------|----------|--------|----------|
`;

  linkedVulnerabilities.forEach((vuln) => {
    const cve = vuln.vulnerability.cve;
    const package = vuln.package;
    const installedVersion = vuln.installedVersion || "Unknown";
    const severity = vuln.vulnerability.baseSeverity || "Unknown";
    const status = vuln.vulnerability.status || "Unknown";
    const nistUrl = generateCVEOfficialDetailsUrl(cve); // Generates a link to the CVE details page

    table += `| ${cve} | ${package} | ${installedVersion} | ${severity} | ${status} | [Details](${nistUrl}) |\n`;
  });

  return table;
}

function generateCVEOfficialDetailsUrl(cve) {
  return `https://nvd.nist.gov/vuln/detail/${cve}`;
}

module.exports = { generateCVEMap, generateOSK8sMarkdownTable, generateCVEOfficialDetailsUrl };
