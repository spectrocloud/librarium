const { generateMarkdownTable } = require("./affected-table");

describe("generateMarkdownTable", () => {
  it("should generate a markdown table for two products with mixed impact", () => {
    const cveImpactMap = {
      palette: { impacts: true, versions: ["4.4.20", "4.5.3"] },
      paletteAirgap: { impacts: false, versions: [] },
      vertex: { impacts: false, versions: [] },
      vertexAirgap: { impacts: false, versions: [] },
    };

    const expectedTable = `| Version | Palette Enterprise | Palette Enterprise Airgap | VerteX | VerteX Airgap |
| - | -------- | -------- | -------- | -------- |
| 4.5.3 | ⚠️ Impacted | ✅ No Impact | ✅ No Impact | ✅ No Impact |
| 4.4.20 | ⚠️ Impacted | ✅ No Impact | ✅ No Impact | ✅ No Impact |`;

    expect(generateMarkdownTable(cveImpactMap).replace(/\s+/g, "")).toBe(expectedTable.replace(/\s+/g, ""));
  });

  it("should return investigation message when all products are not impacted", () => {
    const cveImpactMap = {
      palette: { impacts: false, versions: [] },
      paletteAirgap: { impacts: false, versions: [] },
      vertex: { impacts: false, versions: [] },
      vertexAirgap: { impacts: false, versions: [] },
    };

    const expectedMessage = "Investigation is ongoing to determine how this vulnerability affects our products.";
    expect(generateMarkdownTable(cveImpactMap)).toBe(expectedMessage);
  });

  it("should throw an error when products are impacted but no versions are provided", () => {
    const cveImpactMap = {
      palette: { impacts: true, versions: [] },
      paletteAirgap: { impacts: false, versions: [] },
      vertex: { impacts: false, versions: [] },
      vertexAirgap: { impacts: false, versions: [] },
    };

    expect(() => generateMarkdownTable(cveImpactMap)).toThrow(
      "Error: Data inconsistency - Products impacted but no versions provided."
    );
  });

  it("keeps only latest patch when all versions belong to same product", () => {
    const map = {
      palette: { impacts: true, versions: ["4.6.22", "4.6.24", "4.6.23"] },
      paletteAirgap: { impacts: false, versions: [] },
      vertex: { impacts: false, versions: [] },
      vertexAirgap: { impacts: false, versions: [] },
    };

    const result = generateMarkdownTable(map);
    expect(result).toContain("| 4.6.24 | ⚠️ Impacted | ✅ No Impact | ✅ No Impact | ✅ No Impact |");
    expect(result).not.toContain("4.6.22");
    expect(result).not.toContain("4.6.23");
  });

  it("keeps only latest patch when all product impacts are  the same between versions", () => {
    const map = {
      palette: { impacts: true, versions: ["4.6.22", "4.6.24", "4.6.23"] },
      paletteAirgap: { impacts: false, versions: [] },
      vertex: { impacts: true, versions: ["4.6.22", "4.6.24", "4.6.23"] },
      vertexAirgap: { impacts: false, versions: [] },
    };

    const result = generateMarkdownTable(map);
    expect(result).toContain("| 4.6.24 | ⚠️ Impacted | ✅ No Impact | ⚠️ Impacted | ✅ No Impact |");
    expect(result).not.toContain("4.6.22");
    expect(result).not.toContain("4.6.23");
  });
});
