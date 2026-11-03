const { archivedVersionHref } = require("./archived-versions");

describe("archivedVersionHref", () => {
  it("should keep the site root for v4.7.x through v4.10.x, the versions without the product directory", () => {
    const versionsWithPaletteAtRoot = {
      "v4.10.x": "https://version-4-10.legacy.docs.spectrocloud.com",
      "v4.9.x": "https://version-4-9.legacy.docs.spectrocloud.com",
      "v4.8.x": "https://version-4-8.legacy.docs.spectrocloud.com",
      "v4.7.x": "https://version-4-7.legacy.docs.spectrocloud.com",
    };
    for (const [versionName, versionUrl] of Object.entries(versionsWithPaletteAtRoot)) {
      expect(archivedVersionHref(versionName, versionUrl)).toBe(versionUrl);
    }
  });

  it("should keep the site root for older versions, even when text follows vX.Y, as in 'v3.4.x and prior'", () => {
    expect(archivedVersionHref("v3.4.x and prior", "https://version-3-4.legacy.docs.spectrocloud.com")).toBe(
      "https://version-3-4.legacy.docs.spectrocloud.com"
    );
  });

  it("should link to /palette/ for a minor version newer than v4.10.x", () => {
    expect(archivedVersionHref("v4.11.x", "https://version-4-11.legacy.docs.spectrocloud.com")).toBe(
      "https://version-4-11.legacy.docs.spectrocloud.com/palette/"
    );
  });

  it("should link to /palette/ for a major version newer than v4.10.x", () => {
    expect(archivedVersionHref("v5.0.x", "https://version-5-0.legacy.docs.spectrocloud.com")).toBe(
      "https://version-5-0.legacy.docs.spectrocloud.com/palette/"
    );
  });

  it("should keep the site root when the name does not start with vX.Y", () => {
    expect(archivedVersionHref("legacy", "https://legacy.docs.spectrocloud.com")).toBe(
      "https://legacy.docs.spectrocloud.com"
    );
  });
});
