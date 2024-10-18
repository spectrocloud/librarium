const { generateMarkdownTable } = require("./affected-table");

describe("generateMarkdownTable", () => {
  it("should generate a markdown table for two products with mixed impact", () => {
    const impactData = { palette: true, vertex: false };
    const versions = ["4.4.20", "4.5.3"];
    const productMap = { palette: "Palette Enterprise", vertex: "VerteX" };
    const impactedDeployments = { airgap: false, connected: true };

    const expectedTable = `| Versions | Palette Enterprise Airgap | Palette Enterprise | VerteX Airgap | VerteX |
|-|--------|--------|--------|--------|
| 4.4.20 | No Impact | Impacted | No Impact | No Impact |
| 4.5.3 | No Impact | Impacted | No Impact | No Impact |`;

    expect(generateMarkdownTable(impactData, versions, productMap, impactedDeployments).replace(/\s+/g, "")).toBe(
      expectedTable.replace(/\s+/g, "")
    );
  });

  it("should return investigation message when all products are not impacted", () => {
    const impactData = { palette: false, vertex: false };
    const versions = ["4.4.20", "4.5.3"];
    const productMap = { palette: "Palette", vertex: "VerteX" };
    const impactedDeployments = { airgap: false, connected: true };

    const expectedMessage = "Investigation is ongoing to determine how this vulnerability affects our products";
    expect(generateMarkdownTable(impactData, versions, productMap, impactedDeployments)).toBe(expectedMessage);
  });

  it("should throw an error when products are impacted but no versions are provided", () => {
    const impactData = { palette: true, vertex: false };
    const versions = [];
    const productMap = { palette: "Palette", vertex: "VerteX" };
    const impactedDeployments = { airgap: false, connected: true };

    expect(() => generateMarkdownTable(impactData, versions, productMap, impactedDeployments)).toThrow(
      "Error: Data inconsistency - Products impacted but no versions provided."
    );
  });
});
