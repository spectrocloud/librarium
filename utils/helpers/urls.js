// generateCVEOfficialDetailsUrl returns a URL that is used to link to the official CVE report.
// The URL is generated based on the cveId.
// The function checks if the cveId starts with "ghsa" and returns a GitHub Security Advisory URL. Other formal sites can be added in the future.
// The default URL is the NVD official CVE report.
function generateCVEOfficialDetailsUrl(cveId) {
  let url;

  // If cveId is empty, return the default reports page URL
  if (!cveId) {
    return "/security-bulletins/reports/";
  }

  switch (true) {
    // GitHub Security Advisory
    case cveId.toLocaleLowerCase().startsWith("ghsa"):
      url = `https://github.com/advisories/${cveId.toLocaleLowerCase()}`;
      break;
    // Default CVE URL
    default:
      url = `https://nvd.nist.gov/vuln/detail/${cveId.toLocaleLowerCase()}`;
  }

  return url;
}

module.exports = {
  generateCVEOfficialDetailsUrl,
};
