const semver = require("semver");

function generateMarkdownTable(cveImpactMap) {
  if (!cveImpactMap || typeof cveImpactMap !== "object") {
    throw new Error("Invalid input: cveImpactMap must be an object.");
  }

  // Extract impact data and ensure consistency
  const impactData = {
    "Palette Enterprise": cveImpactMap.palette,
    "Palette Enterprise Airgap": cveImpactMap.paletteAirgap,
    VerteX: cveImpactMap.vertex,
    "VerteX Airgap": cveImpactMap.vertexAirgap,
  };

  // Check if all products are not impacted
  const allProductsFalse = Object.values(impactData).every((product) => product.impacts === false);
  if (allProductsFalse) {
    return "Investigation is ongoing to determine how this vulnerability affects our products.";
  }

  // Check for any product impacted but no versions provided
  const anyProductTrueNoVersions = Object.values(impactData).some(
    (product) => product.impacts && (!product.versions || product.versions.length === 0)
  );
  if (anyProductTrueNoVersions) {
    throw new Error("Error: Data inconsistency - Products impacted but no versions provided.");
  }

  // Collect all unique versions across all products
  const allVersions = Object.values(impactData)
    .flatMap((product) => product.versions || [])
    .filter((version) => semver.valid(version));
  const uniqueVersions = Array.from(new Set(allVersions)).sort(semver.rcompare);

  // Create the header row
  const header = `| Version | Palette Enterprise | Palette Enterprise Airgap | VerteX | VerteX Airgap |\n`;
  const separator = `| - | -------- | -------- | -------- | -------- |\n`;

  // Create rows for each version
  const rows = uniqueVersions
    .map((version) => {
      const row = [
        `| ${version}`,
        impactData["Palette Enterprise"].impacts && impactData["Palette Enterprise"].versions.includes(version)
          ? "⚠️ Impacted"
          : "✅ No Impact",
        impactData["Palette Enterprise Airgap"].impacts &&
        impactData["Palette Enterprise Airgap"].versions.includes(version)
          ? "⚠️ Impacted"
          : "✅ No Impact",
        impactData["VerteX"].impacts && impactData["VerteX"].versions.includes(version)
          ? "⚠️ Impacted"
          : "✅ No Impact",
        impactData["VerteX Airgap"].impacts && impactData["VerteX Airgap"].versions.includes(version)
          ? "⚠️ Impacted"
          : "✅ No Impact",
      ].join(" | ");
      return row + " |";
    })
    .join("\n");
  return header + separator + rows;
}

module.exports = { generateMarkdownTable };
