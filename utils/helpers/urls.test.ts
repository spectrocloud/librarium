const { generateCVEOfficialDetailsUrl } = require("./urls");

describe("generateCVEOfficialDetailsUrl", () => {
  it("should generate the GitHub Security Advisory URL for CVEs starting with 'ghsa'", () => {
    const cveId = "GHSA-27wf-5967-98gx";
    const result = generateCVEOfficialDetailsUrl(cveId);
    expect(result).toBe("https://github.com/advisories/ghsa-27wf-5967-98gx");
  });

  it("should handle 'ghsa' case-insensitively and generate the correct URL", () => {
    const cveId = "ghsa-27wf-5967-98gx";
    const result = generateCVEOfficialDetailsUrl(cveId);
    expect(result).toBe("https://github.com/advisories/ghsa-27wf-5967-98gx");
  });

  it("should generate the NVD URL for a CVE ID not starting with 'ghsa'", () => {
    const cveId = "CVE-2020-16156";
    const result = generateCVEOfficialDetailsUrl(cveId);
    expect(result).toBe("https://nvd.nist.gov/vuln/detail/cve-2020-16156");
  });

  it("should generate the NVD URL for another CVE ID not starting with 'ghsa'", () => {
    const cveId = "CVE-2019-20838";
    const result = generateCVEOfficialDetailsUrl(cveId);
    expect(result).toBe("https://nvd.nist.gov/vuln/detail/cve-2019-20838");
  });

  it("should return the default reports page URL for an empty CVE ID", () => {
    const cveId = "";
    const result = generateCVEOfficialDetailsUrl(cveId);
    expect(result).toBe("/security-bulletins/reports/");
  });

  it("should return the NVD URL for a CVE ID with mixed case and normalize it", () => {
    const cveId = "CVE-2020-16156";
    const result = generateCVEOfficialDetailsUrl(cveId);
    expect(result).toBe("https://nvd.nist.gov/vuln/detail/cve-2020-16156");
  });
});
