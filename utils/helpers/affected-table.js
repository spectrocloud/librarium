const semver = require("semver");

function generateMarkdownTable(cveImpactMap) {
  if (!cveImpactMap || typeof cveImpactMap !== "object") {
    throw new Error("Invalid input: cveImpactMap must be an object.");
  }

  const impactData = {
    "Palette Enterprise": cveImpactMap.palette,
    "Palette Enterprise Airgap": cveImpactMap.paletteAirgap,
    VerteX: cveImpactMap.vertex,
    "VerteX Airgap": cveImpactMap.vertexAirgap,
  };

  const allProductsFalse = Object.values(impactData).every((product) => product.impacts === false);
  if (allProductsFalse) {
    return "Investigation is ongoing to determine how this vulnerability affects our products.";
  }

  const anyProductTrueNoVersions = Object.values(impactData).some(
    (product) => product.impacts && (!product.versions || product.versions.length === 0)
  );
  if (anyProductTrueNoVersions) {
    throw new Error("Error: Data inconsistency - Products impacted but no versions provided.");
  }

  // Step 1: Gather impacted versions by product
  const productVersions = {};
  for (const [product, data] of Object.entries(impactData)) {
    productVersions[product] = data.impacts ? (data.versions || []).filter((v) => semver.valid(v)) : [];
  }

  // Step 2: Collect all impacted versions across all products
  const allImpactedVersions = Object.values(productVersions).flat();
  const groupedByMinor = {};

  for (const version of allImpactedVersions) {
    const parsed = semver.parse(version);
    if (!parsed) continue;
    const minorKey = `${parsed.major}.${parsed.minor}`;
    if (!groupedByMinor[minorKey]) {
      groupedByMinor[minorKey] = new Set();
    }
    groupedByMinor[minorKey].add(version);
  }

  // Step 3: Filter versions per minor key
  const finalVersions = new Set();

  for (const [minor, versions] of Object.entries(groupedByMinor)) {
    const versionList = Array.from(versions);
    const latestPatch = versionList.sort(semver.rcompare)[0]; // highest version in this minor line
    finalVersions.add(latestPatch);
  }

  const sortedVersions = Array.from(finalVersions).sort(semver.rcompare);

  const header = `| Version | Palette Enterprise | Palette Enterprise Airgap | VerteX | VerteX Airgap |\n`;
  const separator = `| - | -------- | -------- | -------- | -------- |\n`;

  const rows = sortedVersions
    .map((version) => {
      const row = [
        `| ${version}`,
        productVersions["Palette Enterprise"].includes(version) ? "⚠️ Impacted" : "✅ No Impact",
        productVersions["Palette Enterprise Airgap"].includes(version) ? "⚠️ Impacted" : "✅ No Impact",
        productVersions["VerteX"].includes(version) ? "⚠️ Impacted" : "✅ No Impact",
        productVersions["VerteX Airgap"].includes(version) ? "⚠️ Impacted" : "✅ No Impact",
      ].join(" | ");
      return row + " |";
    })
    .join("\n");

  return header + separator + rows;
}

module.exports = { generateMarkdownTable };
