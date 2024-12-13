// Import the function
const { generateCVEMap } = require("./cveHelpers");

describe("generateCVEMap", () => {
  test("returns an empty map when given no CVE data", () => {
    const input = [];
    const result = generateCVEMap(input);
    expect(result).toEqual({});
  });

  test("processes a single CVE correctly for Palette Enterprise", () => {
    const input = [
      {
        metadata: { cve: "CVE-1234-5678" },
        spec: {
          impact: {
            impactedProducts: { palette: true, vertex: false },
            impactedDeployments: { airgap: false },
            impactedVersions: ["1.0", "1.1"],
          },
        },
      },
    ];
    const result = generateCVEMap(input);
    expect(result).toEqual({
      "CVE-1234-5678": {
        palette: { impacts: true, versions: ["1.0", "1.1"] },
        paletteAirgap: { impacts: false, versions: [] },
        vertex: { impacts: false, versions: [] },
        vertexAirgap: { impacts: false, versions: [] },
      },
    });
  });

  test("processes a single CVE correctly for Palette Enterprise Airgap", () => {
    const input = [
      {
        metadata: { cve: "CVE-2345-6789" },
        spec: {
          impact: {
            impactedProducts: { palette: true, vertex: false },
            impactedDeployments: { airgap: true },
            impactedVersions: ["2.0"],
          },
        },
      },
    ];
    const result = generateCVEMap(input);
    expect(result).toEqual({
      "CVE-2345-6789": {
        palette: { impacts: false, versions: [] },
        paletteAirgap: { impacts: true, versions: ["2.0"] },
        vertex: { impacts: false, versions: [] },
        vertexAirgap: { impacts: false, versions: [] },
      },
    });
  });

  test("processes multiple CVEs correctly", () => {
    const input = [
      {
        metadata: { cve: "CVE-3456-7890" },
        spec: {
          impact: {
            impactedProducts: { palette: true, vertex: false },
            impactedDeployments: { airgap: false },
            impactedVersions: ["3.0"],
          },
        },
      },
      {
        metadata: { cve: "CVE-3456-7890" },
        spec: {
          impact: {
            impactedProducts: { vertex: true },
            impactedDeployments: { airgap: true },
            impactedVersions: ["3.1"],
          },
        },
      },
    ];
    const result = generateCVEMap(input);
    expect(result).toEqual({
      "CVE-3456-7890": {
        palette: { impacts: true, versions: ["3.0"] },
        paletteAirgap: { impacts: false, versions: [] },
        vertex: { impacts: false, versions: [] },
        vertexAirgap: { impacts: true, versions: ["3.1"] },
      },
    });
  });

  test("handles mixed product and airgap impacts", () => {
    const input = [
      {
        metadata: { cve: "CVE-4567-8901" },
        spec: {
          impact: {
            impactedProducts: { palette: true, vertex: true },
            impactedDeployments: { airgap: true },
            impactedVersions: ["4.0"],
          },
        },
      },
    ];
    const result = generateCVEMap(input);
    expect(result).toEqual({
      "CVE-4567-8901": {
        palette: { impacts: false, versions: [] },
        paletteAirgap: { impacts: true, versions: ["4.0"] },
        vertex: { impacts: false, versions: [] },
        vertexAirgap: { impacts: true, versions: ["4.0"] },
      },
    });
  });

  test("handles different versions for each palette edition", () => {
    const input = [
      {
        metadata: { cve: "CVE-5678-9012" },
        spec: {
          impact: {
            impactedProducts: { palette: true },
            impactedDeployments: { airgap: false },
            impactedVersions: ["1.2", "1.3"],
          },
        },
      },
      {
        metadata: { cve: "CVE-5678-9012" },
        spec: {
          impact: {
            impactedProducts: { palette: true },
            impactedDeployments: { airgap: true },
            impactedVersions: ["1.4"],
          },
        },
      },
      {
        metadata: { cve: "CVE-5678-9012" },
        spec: {
          impact: {
            impactedProducts: { vertex: true },
            impactedDeployments: { airgap: true },
            impactedVersions: ["1.4", "2.3", "2.4"],
          },
        },
      },
    ];
    const result = generateCVEMap(input);
    expect(result).toEqual({
      "CVE-5678-9012": {
        palette: { impacts: true, versions: ["1.2", "1.3"] },
        paletteAirgap: { impacts: true, versions: ["1.4"] },
        vertex: { impacts: false, versions: [] },
        vertexAirgap: { impacts: true, versions: ["1.4", "2.3", "2.4"] },
      },
    });
  });
});
