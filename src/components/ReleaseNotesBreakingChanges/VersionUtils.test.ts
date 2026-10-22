import { compareVersions, isGreaterVersion, isVersionInRange } from "./VersionUtils";

describe("compareVersions", () => {
  it("orders patch releases after their base release and before the next release", () => {
    const versions = ["4.10.17", "4.10.18", "4.10.2", "4.10.17-patch.5", "4.9.30", "4.10.17-patch.1"];
    expect([...versions].sort((a, b) => compareVersions(a, b, "DESC"))).toEqual([
      "4.10.18",
      "4.10.17-patch.5",
      "4.10.17-patch.1",
      "4.10.17",
      "4.10.2",
      "4.9.30",
    ]);
    expect([...versions].sort((a, b) => compareVersions(a, b, "ASC"))).toEqual([
      "4.9.30",
      "4.10.2",
      "4.10.17",
      "4.10.17-patch.1",
      "4.10.17-patch.5",
      "4.10.18",
    ]);
  });

  it("orders component updates by the start of their range", () => {
    const componentUpdates = "component-updates-2026-07-TITLE-{February 13, 2026}-RANGE-4.8.6-4.8.27";
    expect(compareVersions(componentUpdates, "4.8.7", "ASC")).toBeLessThan(0);
    expect(compareVersions(componentUpdates, "4.8.5", "ASC")).toBeGreaterThan(0);
    expect(compareVersions(componentUpdates, "4.8.6", "ASC")).toBe(0);
  });
});

describe("isGreaterVersion", () => {
  it("treats a patch release as newer than its base release only", () => {
    expect(isGreaterVersion("4.10.17-patch.5", "4.10.17")).toBe(true);
    expect(isGreaterVersion("4.10.17-patch.5", "4.10.17-patch.1")).toBe(true);
    expect(isGreaterVersion("4.10.18", "4.10.17-patch.5")).toBe(true);
    expect(isGreaterVersion("4.10.17", "4.10.17-patch.5")).toBe(false);
    expect(isGreaterVersion("4.10.17-patch.5", "4.10.17-patch.5")).toBe(false);
  });
});

describe("isVersionInRange", () => {
  it("includes a patch release when upgrading from its base release", () => {
    expect(isVersionInRange("4.10.17-patch.5", "4.10.17", "4.10.25")).toBe(true);
    expect(isVersionInRange("4.10.17-patch.5", "4.10.17", "4.10.17-patch.5")).toBe(true);
  });

  it("excludes a patch release when upgrading from it or to its base release", () => {
    expect(isVersionInRange("4.10.17-patch.5", "4.10.17-patch.5", "4.10.25")).toBe(false);
    expect(isVersionInRange("4.10.17-patch.5", "4.10.16", "4.10.17")).toBe(false);
  });

  it("is exclusive of from and inclusive of to", () => {
    expect(isVersionInRange("4.10.17", "4.10.17", "4.10.25")).toBe(false);
    expect(isVersionInRange("4.10.25", "4.10.17", "4.10.25")).toBe(true);
  });
});
