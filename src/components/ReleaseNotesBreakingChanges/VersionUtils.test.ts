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

  it("orders component updates by the end of their range, just after that release", () => {
    const feb6 = "component-updates-2026-06-TITLE-{February 6, 2026}-RANGE-4.8.6-4.8.27";
    const feb13 = "component-updates-2026-07-TITLE-{February 13, 2026}-RANGE-4.8.6-4.8.27";
    const apr10 = "component-updates-2026-15-TITLE-{April 10, 2026}-RANGE-4.8.6-4.8.47";
    const entries = ["4.8.47", feb13, "4.8.25", apr10, "4.8.33", feb6, "4.8.27"];
    expect([...entries].sort((a, b) => compareVersions(a, b, "ASC"))).toEqual([
      "4.8.25",
      "4.8.27",
      feb6,
      feb13,
      "4.8.33",
      "4.8.47",
      apr10,
    ]);
    expect([...entries].sort((a, b) => compareVersions(a, b, "DESC"))).toEqual([
      apr10,
      "4.8.47",
      "4.8.33",
      feb13,
      feb6,
      "4.8.27",
      "4.8.25",
    ]);
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
    expect(isComponentUpdatesInRange(name, "4.10.27", "4.10.30")).toBe(true);
    expect(isComponentUpdatesInRange(name, "4.10.30", "4.10.33")).toBe(false);
  });

  // The expected results recorded on the ticket, using the two 4.8 entries with breaking changes.
  it.each<[string, string, boolean, boolean]>([
    ["4.8.8", "4.8.25", true, true],
    ["4.8.27", "4.8.33", true, true],
    ["4.8.47", "4.8.52", false, true],
    ["4.7.48", "4.8.9", true, true],
    ["4.8.8", "4.8.9", true, true],
    ["4.8.51", "4.8.52", false, false],
    ["4.7.40", "4.7.48", false, false],
  ])("from %s to %s shows February 13: %s, April 10: %s", (from, to, feb13, apr10) => {
    expect(isComponentUpdatesInRange(componentUpdates("4.8.6-4.8.27"), from, to)).toBe(feb13);
    expect(isComponentUpdatesInRange(componentUpdates("4.8.6-4.8.47"), from, to)).toBe(apr10);
  });

  it("includes a range that encloses the whole upgrade range", () => {
    expect(isComponentUpdatesInRange(componentUpdates("4.10.13-4.10.27"), "4.10.16", "4.10.25")).toBe(true);
  });

  it("includes a range that ends at a patch release for readers on that patch release", () => {
    const name = componentUpdates("4.10.13-4.10.17-patch.5");
    expect(isComponentUpdatesInRange(name, "4.10.17-patch.5", "4.10.25")).toBe(true);
    expect(isComponentUpdatesInRange(name, "4.10.25", "4.10.27")).toBe(false);
  });

  it("does not throw for a single-version range outside the upgrade range", () => {
    expect(() => isComponentUpdatesInRange(componentUpdates("4.9.5"), "4.10.17", "4.10.25")).not.toThrow();
    expect(isComponentUpdatesInRange(componentUpdates("4.9.5"), "4.10.17", "4.10.25")).toBe(false);
    expect(isComponentUpdatesInRange(componentUpdates("4.9.5"), "4.9.4", "4.9.6")).toBe(true);
  });
});

describe("compareVersions with patch ranges", () => {
  it("orders a component updates range by its end, keeping the -patch.N suffix", () => {
    expect(compareVersions(componentUpdates("4.10.13-4.10.17-patch.5"), "4.10.17-patch.5", "ASC")).toBeGreaterThan(0);
    expect(compareVersions(componentUpdates("4.10.13-4.10.17-patch.5"), "4.10.18", "ASC")).toBeLessThan(0);
  });
});
