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

function generateOSK8sMarkdownTable(linkedVulnerabilities) {
  if (!linkedVulnerabilities || linkedVulnerabilities.length === 0) {
    return "No linked vulnerabilities found.";
  }

  // Define severity ranking
  const severityRank = {
    CRITICAL: 4,
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1,
    UNKNOWN: 0,
  };

  // Create a map to deduplicate by CVE ID
  const cveMap = new Map();

  linkedVulnerabilities.forEach((entry) => {
    const vuln = entry.vulnerability;
    const cve = vuln.cve;
    const severity = (vuln.baseSeverity || "UNKNOWN").toUpperCase();

    // If we haven't seen this CVE or found a more severe instance, store/update it
    if (
      !cveMap.has(cve) ||
      severityRank[severity] > severityRank[(cveMap.get(cve).vulnerability.baseSeverity || "UNKNOWN").toUpperCase()]
    ) {
      cveMap.set(cve, entry);
    }
  });

  // Sort deduplicated vulnerabilities by severity
  const uniqueVulns = Array.from(cveMap.values()).sort((a, b) => {
    const aSeverity = (a.vulnerability.baseSeverity || "UNKNOWN").toUpperCase();
    const bSeverity = (b.vulnerability.baseSeverity || "UNKNOWN").toUpperCase();
    return severityRank[bSeverity] - severityRank[aSeverity];
  });

  // Build table
  let table = `| CVE ID | Package | Installed Version | Severity | NIST Link |
|--------|---------|-------------------|----------|-----------|
`;

  uniqueVulns.forEach((vuln) => {
    const cve = vuln.vulnerability.cve;
    const pkg = vuln.package;
    const version = vuln.installedVersion || "Unknown";
    const severity = vuln.vulnerability.baseSeverity || "Unknown";
    const url = generateCVEOfficialDetailsUrl(cve);

    table += `| ${cve} | ${pkg} | ${version} | ${severity} | [Details](${url}) |\n`;
  });

  return table;
}

function generateCVEOfficialDetailsUrl(cve) {
  return `https://nvd.nist.gov/vuln/detail/${cve}`;
}

module.exports = { generateCVEMap, generateOSK8sMarkdownTable, generateCVEOfficialDetailsUrl };
