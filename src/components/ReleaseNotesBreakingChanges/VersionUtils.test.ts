import {
  compareVersions,
  isComponentUpdatesInRange,
  isGreaterVersion,
  isVersionInRange,
  parseComponentUpdatesRange,
} from "./VersionUtils";

const componentUpdates = (range: string) => `component-updates-2026-43-TITLE-{October 23, 2026}-RANGE-${range}`;

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

describe("parseComponentUpdatesRange", () => {
  it("splits a range of plain versions", () => {
    expect(parseComponentUpdatesRange(componentUpdates("4.8.6-4.8.27"))).toEqual(["4.8.6", "4.8.27"]);
  });

  it("keeps a -patch.N suffix on either end", () => {
    expect(parseComponentUpdatesRange(componentUpdates("4.10.17-patch.5-4.10.27"))).toEqual([
      "4.10.17-patch.5",
      "4.10.27",
    ]);
    expect(parseComponentUpdatesRange(componentUpdates("4.10.13-4.10.17-patch.5"))).toEqual([
      "4.10.13",
      "4.10.17-patch.5",
    ]);
  });

  it("treats a single version as a range of one", () => {
    expect(parseComponentUpdatesRange(componentUpdates("4.9.5"))).toEqual(["4.9.5", "4.9.5"]);
    expect(parseComponentUpdatesRange(componentUpdates("4.10.17-patch.5"))).toEqual([
      "4.10.17-patch.5",
      "4.10.17-patch.5",
    ]);
  });

  it("accepts an en dash or an em dash between the versions", () => {
    expect(parseComponentUpdatesRange(componentUpdates("4.7.21\u20134.7.23"))).toEqual(["4.7.21", "4.7.23"]);
    expect(parseComponentUpdatesRange(componentUpdates("4.7.21\u20144.7.23"))).toEqual(["4.7.21", "4.7.23"]);
  });
});

describe("isComponentUpdatesInRange", () => {
  it("includes a range that starts at a patch release for the matching upgrade", () => {
    const name = componentUpdates("4.10.17-patch.5-4.10.27");
    expect(isComponentUpdatesInRange(name, "4.10.17-patch.1", "4.10.17-patch.5")).toBe(true);
    expect(isComponentUpdatesInRange(name, "4.10.25", "4.10.27")).toBe(true);
    expect(isComponentUpdatesInRange(name, "4.10.27", "4.10.30")).toBe(false);
  });

  it("does not throw for a single-version range outside the upgrade range", () => {
    expect(() => isComponentUpdatesInRange(componentUpdates("4.9.5"), "4.10.17", "4.10.25")).not.toThrow();
    expect(isComponentUpdatesInRange(componentUpdates("4.9.5"), "4.10.17", "4.10.25")).toBe(false);
    expect(isComponentUpdatesInRange(componentUpdates("4.9.5"), "4.9.4", "4.9.6")).toBe(true);
  });
});

describe("compareVersions with patch ranges", () => {
  it("orders a component updates range by its start, keeping the -patch.N suffix", () => {
    expect(compareVersions(componentUpdates("4.10.17-patch.5-4.10.27"), "4.10.17-patch.1", "ASC")).toBeGreaterThan(0);
    expect(compareVersions(componentUpdates("4.10.17-patch.5-4.10.27"), "4.10.18", "ASC")).toBeLessThan(0);
  });
});
