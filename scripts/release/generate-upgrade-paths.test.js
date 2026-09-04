const {
  applyK8sConstraint,
  bundledK8s,
  diffRows,
  isKnownDropStatus,
  newReport,
  parseBundledK8sVersions,
  parseRenderedRows,
  parseUpgradePaths,
  renderTable,
  replaceUpgradePathMarkers,
  splitTableRow,
  statusToMark,
} = require("./generate-upgrade-paths");

const CHECK = ":white_check_mark:";
const CROSS = ":x:";
const QUESTION = "[:question:](#kubernetes-version-constraint)";

// A trimmed stand-in for the Confluence "Release Artifacts" storage format: one
// version-pair group with a matrix table per install type.
const CONFLUENCE_HTML = `
<h1>Upgrade Paths</h1>
<h2>4.8.x / 4.7.x to 4.9.x</h2>
<h3>EC Install</h3>
<table>
  <tr><td></td><td></td><td>target</td><td>target</td></tr>
  <tr><td>from &#11015;</td><td>to &#10145;</td><td>4.9.14</td><td>4.9.24</td></tr>
  <tr><td></td><td>4.8.61</td><td>Supported</td><td>Supported</td></tr>
  <tr><td></td><td>4.7.38</td><td>Supported</td><td>N/A</td></tr>
</table>
<h3>Helm Install</h3>
<table>
  <tr><td></td><td></td><td>target</td><td>target</td></tr>
  <tr><td>from &#11015;</td><td>to &#10145;</td><td>4.9.14</td><td>4.9.24</td></tr>
  <tr><td></td><td>4.8.61</td><td>Supported</td><td>Supported</td></tr>
</table>
<h3>Appliance Installer</h3>
<table>
  <tr><td></td><td></td><td>target</td><td>target</td></tr>
  <tr><td>from &#11015;</td><td>to &#10145;</td><td>4.9.14</td><td>4.9.24</td></tr>
  <tr><td></td><td>4.8.61</td><td>Supported</td><td>Supported</td></tr>
</table>
`;

// The Kubernetes version table as it appears on the upgrade pages, including both
// cell shapes: an explicit release list and an "and later" floor.
const MARKDOWN_K8S_SECTION = `
### Kubernetes Version Constraint

Some prose about the constraint.

| Palette Release                | Kubernetes Version |
| :----------------------------- | :----------------: |
| 4.7.40, 4.7.43                 |       1.31.8       |
| 4.8.54, 4.8.56, 4.8.58, 4.8.61 |       1.32.9       |
| 4.9.5, 4.9.8, 4.9.14           |      1.33.10       |
| 4.9.23 and later               |       1.34.6       |

More prose.

## Upgrade Guides
`;

describe("splitTableRow", () => {
  it("trims cells and tolerates Prettier's alignment padding", () => {
    expect(splitTableRow("|       4.8.61       |       4.9.24       | :x: |")).toEqual([
      "4.8.61",
      "4.9.24",
      ":x:",
    ]);
  });

  it("tolerates rows written without outer pipes", () => {
    expect(splitTableRow("4.8.61 | 4.9.24")).toEqual(["4.8.61", "4.9.24"]);
  });

  it("returns nothing for a line that is not a table row", () => {
    expect(splitTableRow("Some prose.")).toEqual([]);
  });
});

describe("statusToMark", () => {
  it("classifies the plain statuses", () => {
    expect(statusToMark("Supported")).toBe(CHECK);
    expect(statusToMark("Verified")).toBe(CHECK);
    expect(statusToMark("Not Supported")).toBe(CROSS);
    expect(statusToMark("Fails")).toBe(CROSS);
    expect(statusToMark("Staggered")).toBe(QUESTION);
  });

  it("matches by keyword so an editorialized cell still classifies", () => {
    // These dropped to null under exact-equality matching, which deleted the row.
    expect(statusToMark("Supported (staggered)")).toBe(QUESTION);
    expect(statusToMark("Staggered - see note")).toBe(QUESTION);
    expect(statusToMark("Supported*")).toBe(CHECK);
    expect(statusToMark("  NOT SUPPORTED  ")).toBe(CROSS);
  });

  it("tests the narrower cases first", () => {
    // "not supported" contains "supported"; a staggered cell usually says both.
    expect(statusToMark("Not supported directly, upgrade in two steps")).toBe(QUESTION);
    expect(statusToMark("Not yet supported")).toBe(CROSS);
  });

  it("drops the expected publish-nothing values", () => {
    for (const value of ["", "N/A", "n/a", "In Progress", "TBD", "  "]) {
      expect(statusToMark(value)).toBeNull();
      expect(isKnownDropStatus(value)).toBe(true);
    }
  });

  it("reports an unknown value rather than treating it as a known drop", () => {
    expect(statusToMark("ask QA")).toBeNull();
    expect(isKnownDropStatus("ask QA")).toBe(false);
  });
});

describe("parseBundledK8sVersions", () => {
  const map = parseBundledK8sVersions(MARKDOWN_K8S_SECTION);

  it("reads an explicit release list", () => {
    expect(bundledK8s(map, "4.8.61")).toEqual({ major: 1, minor: 32 });
    expect(bundledK8s(map, "4.7.40")).toEqual({ major: 1, minor: 31 });
    expect(bundledK8s(map, "4.9.14")).toEqual({ major: 1, minor: 33 });
  });

  it("applies an 'and later' floor to later patches of the same minor", () => {
    expect(bundledK8s(map, "4.9.23")).toEqual({ major: 1, minor: 34 });
    expect(bundledK8s(map, "4.9.38")).toEqual({ major: 1, minor: 34 });
  });

  it("confines a floor to its own major.minor", () => {
    // "4.9.23 and later" must not claim to describe the next minor release.
    expect(bundledK8s(map, "4.10.0")).toBeNull();
  });

  it("returns null for a release the table does not describe", () => {
    expect(bundledK8s(map, "4.7.38")).toBeNull();
    expect(bundledK8s(map, "4.6.70")).toBeNull();
  });

  it("returns an empty map when the section is absent", () => {
    const empty = parseBundledK8sVersions("# Upgrade\n\nNo constraint section here.\n");
    expect(empty.exact.size).toBe(0);
    expect(empty.floors).toEqual([]);
  });
});

describe("applyK8sConstraint", () => {
  const k8sMap = parseBundledK8sVersions(MARKDOWN_K8S_SECTION);

  function run(pathsByInstall) {
    const report = { unmapped: new Set(), staggered: [] };
    applyK8sConstraint(pathsByInstall, k8sMap, report);
    return report;
  }

  it("staggers a path that crosses two Kubernetes minor versions", () => {
    const paths = { vmware: [{ source: "4.8.61", target: "4.9.24", support: CHECK }] };
    const report = run(paths);
    expect(paths.vmware[0].support).toBe(QUESTION);
    expect(report.staggered).toEqual([
      "vmware: 4.8.61 -> 4.9.24 (Kubernetes 1.32 -> 1.34)",
    ]);
  });

  it("leaves a single-minor hop alone", () => {
    const paths = { vmware: [{ source: "4.8.61", target: "4.9.14", support: CHECK }] };
    run(paths);
    expect(paths.vmware[0].support).toBe(CHECK);
  });

  it("exempts Helm installs on a customer-managed cluster", () => {
    const paths = { kubernetes: [{ source: "4.8.61", target: "4.9.24", support: CHECK }] };
    const report = run(paths);
    expect(paths.kubernetes[0].support).toBe(CHECK);
    expect(report.staggered).toEqual([]);
  });

  it("applies to appliance installs", () => {
    const paths = { appliance: [{ source: "4.8.61", target: "4.9.24", support: CHECK }] };
    run(paths);
    expect(paths.appliance[0].support).toBe(QUESTION);
  });

  it("never overrides an explicit unsupported mark", () => {
    const paths = { vmware: [{ source: "4.8.61", target: "4.9.24", support: CROSS }] };
    run(paths);
    expect(paths.vmware[0].support).toBe(CROSS);
  });

  it("fails open and reports a release the version table does not describe", () => {
    const paths = { vmware: [{ source: "4.7.38", target: "4.9.14", support: CHECK }] };
    const report = run(paths);
    expect(paths.vmware[0].support).toBe(CHECK);
    expect([...report.unmapped]).toEqual(["4.7.38"]);
  });

  it("stays quiet when both ends predate the version table", () => {
    const paths = { vmware: [{ source: "4.6.70", target: "4.7.14", support: CHECK }] };
    const report = run(paths);
    expect([...report.unmapped]).toEqual([]);
    expect(report.staggered).toEqual([]);
  });
});

describe("parseUpgradePaths", () => {
  it("files each matrix table under its install type", () => {
    const report = newReport();
    const paths = parseUpgradePaths(CONFLUENCE_HTML, report);
    expect(paths.vmware).toEqual([
      { source: "4.8.61", target: "4.9.24", support: CHECK },
      { source: "4.8.61", target: "4.9.14", support: CHECK },
      { source: "4.7.38", target: "4.9.14", support: CHECK },
    ]);
    expect(paths.kubernetes).toHaveLength(2);
    expect(paths.appliance).toHaveLength(2);
    expect(report.orphanTables).toEqual([]);
    expect(report.unrecognizedCells).toEqual([]);
    expect(report.emptyInstalls).toEqual([]);
  });

  it("reads the legacy From / To / Verified table shape", () => {
    const report = newReport();
    const paths = parseUpgradePaths(
      `<h1>Upgrade Paths</h1><h3>EC Install</h3>
       <table>
         <tr><td>From</td><td>To</td><td>Verified?</td></tr>
         <tr><td>4.8.61</td><td>4.9.14</td><td>Supported</td></tr>
         <tr><td>4.8.56</td><td>4.9.14</td><td>Fails</td></tr>
       </table>`,
      report
    );
    expect(paths.vmware).toEqual([
      { source: "4.8.61", target: "4.9.14", support: CHECK },
      { source: "4.8.56", target: "4.9.14", support: CROSS },
    ]);
  });

  it("records a table that has no install-type heading above it", () => {
    const report = newReport();
    // A renamed heading is the dangerous case: the table is discarded and every
    // marker block for that install would silently keep its old content.
    parseUpgradePaths(
      `<h1>Upgrade Paths</h1><h3>Enterprise Cluster Install</h3>
       <table>
         <tr><td></td><td></td><td>target</td></tr>
         <tr><td>from</td><td>to</td><td>4.9.14</td></tr>
         <tr><td></td><td>4.8.61</td><td>Supported</td></tr>
       </table>`,
      report
    );
    expect([...report.unknownHeadings]).toEqual(["Enterprise Cluster Install"]);
    expect(report.orphanTables).toEqual(["Enterprise Cluster Install"]);
    expect(report.emptyInstalls.sort()).toEqual(["appliance", "kubernetes", "vmware"]);
  });

  it("reports a status cell it cannot classify, with enough detail to trace it", () => {
    const report = newReport();
    const paths = parseUpgradePaths(
      `<h1>Upgrade Paths</h1><h3>EC Install</h3>
       <table>
         <tr><td></td><td></td><td>target</td></tr>
         <tr><td>from</td><td>to</td><td>4.9.14</td></tr>
         <tr><td></td><td>4.8.61</td><td>ask QA</td></tr>
       </table>`,
      report
    );
    expect(paths.vmware).toEqual([]);
    expect(report.unrecognizedCells).toEqual(['vmware: 4.8.61 -> 4.9.14 = "ask QA"']);
  });

  it("throws when the Upgrade Paths heading is missing", () => {
    expect(() => parseUpgradePaths("<h1>Something Else</h1>", newReport())).toThrow(
      /Upgrade Paths/
    );
  });
});

describe("diffRows", () => {
  it("separates added, removed, and re-marked rows", () => {
    const before = [
      { source: "4.8.61", target: "4.9.24", support: CHECK },
      { source: "4.8.56", target: "4.9.14", support: CHECK },
    ];
    const after = [
      { source: "4.8.61", target: "4.9.24", support: QUESTION },
      { source: "4.8.52", target: "4.9.14", support: CHECK },
    ];
    expect(diffRows(before, after)).toEqual({
      added: ["4.8.52 -> 4.9.14"],
      removed: ["4.8.56 -> 4.9.14"],
      changed: [`4.8.61 -> 4.9.24: ${CHECK} -> ${QUESTION}`],
    });
  });

  it("reports no change when the rows match", () => {
    const rows = [{ source: "4.8.61", target: "4.9.24", support: CHECK }];
    expect(diffRows(rows, rows)).toEqual({ added: [], removed: [], changed: [] });
  });
});

describe("parseRenderedRows", () => {
  it("reads the rows already published in a marker block", () => {
    const block = renderTable([
      { source: "4.8.61", target: "4.9.24", support: QUESTION },
      { source: "4.8.61", target: "4.9.14", support: CHECK },
    ]);
    expect(parseRenderedRows(block)).toEqual([
      { source: "4.8.61", target: "4.9.24", support: QUESTION },
      { source: "4.8.61", target: "4.9.14", support: CHECK },
    ]);
  });
});

describe("replaceUpgradePathMarkers", () => {
  const markdown = [
    "**4.9**",
    "",
    "<!-- upgrade-paths:vmware-4.9:start -->",
    "",
    "| **Source Version** | **Target Version** | **Support** |",
    "| :----------------: | :----------------: | :---------: |",
    "| 4.8.61 | 4.9.24 | :white_check_mark: |",
    "",
    "<!-- upgrade-paths:vmware-4.9:end -->",
    "",
  ].join("\n");

  it("rewrites the block and reports the marks it changed", () => {
    const [updated, missing, changes] = replaceUpgradePathMarkers(markdown, {
      vmware: [{ source: "4.8.61", target: "4.9.24", support: QUESTION }],
    });
    expect(updated).toContain(`| 4.8.61 | 4.9.24 | ${QUESTION} |`);
    expect(missing).toEqual([]);
    expect(changes).toEqual([
      {
        key: "vmware-4.9",
        diff: {
          added: [],
          removed: [],
          changed: [`4.8.61 -> 4.9.24: ${CHECK} -> ${QUESTION}`],
        },
      },
    ]);
  });

  it("reports nothing when the generated rows match what is published", () => {
    const [, , changes] = replaceUpgradePathMarkers(markdown, {
      vmware: [{ source: "4.8.61", target: "4.9.24", support: CHECK }],
    });
    expect(changes).toEqual([]);
  });

  it("reports a block the Markdown has no marker for", () => {
    const [, missing] = replaceUpgradePathMarkers(markdown, {
      appliance: [{ source: "4.8.61", target: "4.9.24", support: CHECK }],
    });
    expect(missing).toEqual(["appliance-4.9"]);
  });

  it("leaves blocks older than the 4.6 floor untouched", () => {
    const legacy = "<!-- upgrade-paths:vmware-4.5:start -->\n\nold\n\n<!-- upgrade-paths:vmware-4.5:end -->";
    const [updated] = replaceUpgradePathMarkers(legacy, {
      vmware: [{ source: "4.4.1", target: "4.5.1", support: CHECK }],
    });
    expect(updated).toBe(legacy);
  });
});
