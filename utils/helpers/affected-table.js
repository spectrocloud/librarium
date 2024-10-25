function generateMarkdownTable(cveImpactMap) {
  const impactData = {
    "Palette Enterprise": cveImpactMap.impactsPaletteEnterprise,
    "Palette Enterprise Airgap": cveImpactMap.impactsPaletteEnterpriseAirgap,
    VerteX: cveImpactMap.impactsVerteX,
    "VerteX Airgap": cveImpactMap.impactsVerteXAirgap,
  };

  const allProductsFalse = Object.values(impactData).every((value) => value === false);
  if (allProductsFalse) {
    return "Investigation is ongoing to determine how this vulnerability affects our products";
  }

  const anyProductTrue = Object.values(impactData).some((value) => value === true);
  if (anyProductTrue && (!cveImpactMap.versions || cveImpactMap.versions.length === 0)) {
    throw new Error("Error: Data inconsistency - Products impacted but no versions provided.");
  }

  // Create the header row with the specified order
  const header = `| Version | Palette Enterprise | Palette Enterprise Airgap | VerteX | VerteX Airgap |\n`;
  const separator = `| - | -------- | -------- | -------- | -------- |\n`;

  // Use a Set to store unique versions
  const uniqueVersions = new Set(cveImpactMap.versions);

  // Create rows based on unique impacted versions
  const rows = Array.from(uniqueVersions)
    .map((version) => {
      const row = [
        `| ${version}`,
        impactData["Palette Enterprise"] ? "Impacted" : "No Impact",
        impactData["Palette Enterprise Airgap"] ? "Impacted" : "No Impact",
        impactData["VerteX"] ? "Impacted" : "No Impact",
        impactData["VerteX Airgap"] ? "Impacted" : "No Impact",
      ].join(" | ");
      return row + " |";
    })
    .join("\n");

  return header + separator + rows;
}

module.exports = { generateMarkdownTable };
