const {
  checkK8sConstraint,
  diffRows,
  headingMeetsFloor,
  isKnownDropStatus,
  newReport,
  parseK8sLabel,
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
// The EC binary and the Appliance Installer ship different Kubernetes versions for
// the same Palette release, which is why the labels are per table.
const CONFLUENCE_HTML = `
<h1>Upgrade Paths</h1>
<h2>4.8 &#8594; 4.9</h2>
<h3>EC Install</h3>
<table>
  <tr><td>from</td><td></td><td>4.9.x &#183; K8s 1.33.10</td><td>4.9.x &#183; K8s 1.34.6</td></tr>
  <tr><td></td><td>to</td><td>4.9.14</td><td>4.9.24</td></tr>
  <tr><td>4.8.x &#183; K8s 1.32.9</td><td>4.8.61</td><td>Supported</td><td>Not Supported</td></tr>
  <tr><td>4.9.x &#183; K8s 1.33.10</td><td>4.9.14</td><td></td><td>Supported</td></tr>
</table>
<h3>Helm Install</h3>
<table>
  <tr><td>from</td><td></td><td>4.9.x</td><td>4.9.x</td></tr>
  <tr><td></td><td>to</td><td>4.9.14</td><td>4.9.24</td></tr>
  <tr><td>4.8.x</td><td>4.8.61</td><td>Supported</td><td>Supported</td></tr>
</table>
<h3>Appliance Installer</h3>
<table>
  <tr><td>from</td><td></td><td>4.9.x &#183; K8s 1.34.6</td><td>4.9.x &#183; K8s 1.34.9</td></tr>
  <tr><td></td><td>to</td><td>4.9.14</td><td>4.9.24</td></tr>
  <tr><td>4.8.x &#183; K8s 1.33.9</td><td>4.8.61</td><td>Supported</td><td>Supported</td></tr>
</table>
`;

// The Kubernetes version table as it appears on the upgrade pages, including both
// cell shapes: an explicit release list and an "and later" floor.
describe("parseK8sLabel", () => {
  it("reads the version out of a Confluence label cell", () => {
    expect(parseK8sLabel("4.9.x \u00b7 K8s 1.33.10")).toEqual({ major: 1, minor: 33 });
    expect(parseK8sLabel("4.8.x - K8s v1.32.9")).toEqual({ major: 1, minor: 32 });
  });

  it("returns null when the label carries no version", () => {
    // Normal for Helm installs, and for "K8s TBD" on an unreleased version.
    expect(parseK8sLabel("4.9.x")).toBeNull();
    expect(parseK8sLabel("4.10.x \u00b7 K8s TBD")).toBeNull();
    expect(parseK8sLabel("")).toBeNull();
  });
});

describe("headingMeetsFloor", () => {
  it("recognizes an in-scope version group", () => {
    expect(headingMeetsFloor("4.8 \u2192 4.9")).toBe(true);
    expect(headingMeetsFloor("4.6 \u2192 4.7")).toBe(true);
  });

  it("recognizes the hand-maintained legacy groups", () => {
    expect(headingMeetsFloor("4.3 \u2192 4.4")).toBe(false);
    expect(headingMeetsFloor("4.1 through 4.3")).toBe(false);
  });

  it("treats an unreadable heading as in scope so drift is not hidden", () => {
    expect(headingMeetsFloor("Upgrade notes")).toBe(true);
  });
});

describe("checkK8sConstraint", () => {
  function run(pathsByInstall) {
    const report = newReport();
    checkK8sConstraint(pathsByInstall, report);
    return report.constraintConflicts;
  }

  it("reports a supported path that skips a Kubernetes minor version", () => {
    expect(
      run({
        vmware: [
          {
            source: "4.8.61",
            target: "4.9.24",
            support: CHECK,
            sourceK8s: { major: 1, minor: 32 },
            targetK8s: { major: 1, minor: 34 },
          },
        ],
      })
    ).toEqual([
      "vmware: 4.8.61 -> 4.9.24 is marked supported but crosses Kubernetes 1.32 -> 1.34",
    ]);
  });

  it("stays quiet on a single-minor hop", () => {
    // Appliance ships 1.33.9 on 4.8.x and 1.34.9 on 4.9.24+, so this is one minor.
    expect(
      run({
        appliance: [
          {
            source: "4.8.61",
            target: "4.9.24",
            support: CHECK,
            sourceK8s: { major: 1, minor: 33 },
            targetK8s: { major: 1, minor: 34 },
          },
        ],
      })
    ).toEqual([]);
  });

  it("skips paths with no Kubernetes labels, such as Helm installs", () => {
    expect(
      run({
        kubernetes: [
          { source: "4.8.61", target: "4.9.24", support: CHECK, sourceK8s: null, targetK8s: null },
        ],
      })
    ).toEqual([]);
  });

  it("does not report a path that is already marked unsupported", () => {
    expect(
      run({
        vmware: [
          {
            source: "4.8.61",
            target: "4.9.24",
            support: CROSS,
            sourceK8s: { major: 1, minor: 32 },
            targetK8s: { major: 1, minor: 34 },
          },
        ],
      })
    ).toEqual([]);
  });

  it("never rewrites a mark", () => {
    const paths = {
      vmware: [
        {
          source: "4.8.61",
          target: "4.9.24",
          support: CHECK,
          sourceK8s: { major: 1, minor: 32 },
          targetK8s: { major: 1, minor: 34 },
        },
      ],
    };
    checkK8sConstraint(paths, newReport());
    expect(paths.vmware[0].support).toBe(CHECK);
  });
});

describe("parseUpgradePaths", () => {
  it("files each matrix table under its install type", () => {
    const report = newReport();
    const paths = parseUpgradePaths(CONFLUENCE_HTML, report);
    const summarize = (rows) => rows.map((p) => `${p.source} -> ${p.target} ${p.support}`);

    expect(summarize(paths.vmware)).toEqual([
      `4.9.14 -> 4.9.24 ${CHECK}`,
      `4.8.61 -> 4.9.24 ${CROSS}`,
      `4.8.61 -> 4.9.14 ${CHECK}`,
    ]);
    expect(summarize(paths.kubernetes)).toEqual([
      `4.8.61 -> 4.9.24 ${CHECK}`,
      `4.8.61 -> 4.9.14 ${CHECK}`,
    ]);
    expect(summarize(paths.appliance)).toEqual([
      `4.8.61 -> 4.9.24 ${CHECK}`,
      `4.8.61 -> 4.9.14 ${CHECK}`,
    ]);
    expect(report.orphanTables).toEqual([]);
    expect(report.unrecognizedCells).toEqual([]);
    expect(report.emptyInstalls).toEqual([]);
  });

  it("captures the bundled Kubernetes version per install type", () => {
    // The same Palette releases carry different Kubernetes versions on the EC binary
    // and the Appliance Installer, which is why the labels cannot be read from a
    // single table in the docs.
    const paths = parseUpgradePaths(CONFLUENCE_HTML, newReport());
    const ec = paths.vmware.find((p) => p.source === "4.8.61" && p.target === "4.9.24");
    const appliance = paths.appliance.find((p) => p.source === "4.8.61" && p.target === "4.9.24");
    expect(ec.sourceK8s).toEqual({ major: 1, minor: 32 });
    expect(ec.targetK8s).toEqual({ major: 1, minor: 34 });
    expect(appliance.sourceK8s).toEqual({ major: 1, minor: 33 });
    expect(appliance.targetK8s).toEqual({ major: 1, minor: 34 });
    expect(paths.kubernetes[0].sourceK8s).toBeNull();
  });

  it("finds no constraint conflict in a matrix whose marks match its labels", () => {
    const report = newReport();
    const paths = parseUpgradePaths(CONFLUENCE_HTML, report);
    checkK8sConstraint(paths, report);
    expect(report.constraintConflicts).toEqual([]);
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
