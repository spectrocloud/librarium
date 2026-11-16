// The newest archived Palette version whose site shows the "What is Palette?" page at its root. The homepage
// redesign (DOC-1555) moved that page to /palette/ and replaced the root with a product directory that hides the
// version menu. The redesign was not backported, so only archived versions newer than this one have the product
// directory at their root.
const LAST_VERSION_WITH_PALETTE_AT_ROOT = { major: 4, minor: 10 };

// archivedVersionHref returns the version menu link for an archived Palette version.
// versionName is an archiveVersions.json key, such as "v4.10.x", and versionUrl is its site root.
// Versions newer than LAST_VERSION_WITH_PALETTE_AT_ROOT open at /palette/, so readers who pick one land on the
// "What is Palette?" page with the version menu visible. LAST_VERSION_WITH_PALETTE_AT_ROOT itself, older versions,
// and names that do not start with vX.Y open at the site root.
// archiveVersions.json keeps plain site roots, because scripts/index-breaking-changes-utils.sh and
// src/components/ReleaseNotesVersions/ReleaseNotesVersions.tsx append page paths to them.
function archivedVersionHref(versionName, versionUrl) {
  const match = /^v(\d+)\.(\d+)/.exec(versionName);
  if (!match) {
    return versionUrl;
  }

  const major = Number(match[1]);
  const minor = Number(match[2]);
  const { major: lastMajor, minor: lastMinor } = LAST_VERSION_WITH_PALETTE_AT_ROOT;
  if (major < lastMajor || (major === lastMajor && minor <= lastMinor)) {
    return versionUrl;
  }

  return `${versionUrl}/palette/`;
}

module.exports = {
  archivedVersionHref,
};
