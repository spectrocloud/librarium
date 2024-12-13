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

module.exports = { generateCVEMap };
