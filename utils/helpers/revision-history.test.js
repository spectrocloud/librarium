const { generateRevisionHistory } = require("./revision-history");

describe("generateRevisionHistory", () => {
  it("should generate history for justification field changes", () => {
    const revisionHistory = [
      {
        revisionTimestamp: "2024-10-16T05:50:00.194Z",
        revisedField: "spec.assessment.justification",
        revisedFrom: "",
        revisedTo: "Summary text added",
      },
      {
        revisionTimestamp: "2024-10-17T05:50:00.194Z",
        revisedField: "spec.assessment.justification",
        revisedFrom: "Summary text added",
        revisedTo: "Revised summary text",
      },
      {
        revisionTimestamp: "2024-10-18T05:50:00.194Z",
        revisedField: "spec.assessment.justification",
        revisedFrom: "Revised summary text",
        revisedTo: "",
      },
    ];

    const expectedOutput = [
      "| Date | Revision |",
      "| --- | --- |",
      "| 10/18/2024 | Official summary removed |",
      "| 10/17/2024 | Official summary revised: Revised summary text |",
      "| 10/16/2024 | Official summary added |",
    ].join("\n");

    expect(generateRevisionHistory(revisionHistory)).toBe(expectedOutput);
  });

  it("should generate history for NIST severity changes", () => {
    const revisionHistory = [
      {
        revisionTimestamp: "2024-10-16T05:50:00.194Z",
        revisedField: "metadata.nistSeverity",
        revisedFrom: "UNKNOWN",
        revisedTo: "CRITICAL",
      },
      {
        revisionTimestamp: "2024-10-17T05:50:00.194Z",
        revisedField: "metadata.nistSeverity",
        revisedFrom: "CRITICAL",
        revisedTo: "HIGH",
      },
    ];

    const expectedOutput = [
      "| Date | Revision |",
      "| --- | --- |",
      "| 10/17/2024 | Advisory severity revised to HIGH from CRITICAL |",
      "| 10/16/2024 | Advisory assigned with CRITICAL severity |",
    ].join("\n");

    expect(generateRevisionHistory(revisionHistory)).toBe(expectedOutput);
  });

  it("should generate history for impacted versions changes", () => {
    const revisionHistory = [
      {
        revisionTimestamp: "2024-10-16T05:50:00.194Z",
        revisedField: "spec.impact.impactedVersions",
        revisedFrom: "[]",
        revisedTo: "[4.4.20]",
      },
      {
        revisionTimestamp: "2024-10-17T05:50:00.194Z",
        revisedField: "spec.impact.impactedVersions",
        revisedFrom: "[4.4.20]",
        revisedTo: "[4.4.20 4.5.3]",
      },
    ];

    const expectedOutput = [
      "| Date | Revision |",
      "| --- | --- |",
      "| 10/17/2024 | Impacted versions changed from 4.4.20 to 4.4.20, 4.5.3 |",
      "| 10/16/2024 | Added impacted versions: 4.4.20 |",
    ].join("\n");

    expect(generateRevisionHistory(revisionHistory)).toBe(expectedOutput);
  });

  it("should generate history for status changes", () => {
    const revisionHistory = [
      {
        revisionTimestamp: "2024-10-16T05:50:00.194Z",
        revisedField: "status.status",
        revisedFrom: "OPEN",
        revisedTo: "CLOSED",
      },
    ];

    const expectedOutput = [
      "| Date | Revision |",
      "| --- | --- |",
      "| 10/16/2024 | Status changed from OPEN to CLOSED |",
    ].join("\n");

    expect(generateRevisionHistory(revisionHistory)).toBe(expectedOutput);
  });

  it("should generate history for isImpacting changes", () => {
    const revisionHistory = [
      {
        revisionTimestamp: "2024-10-16T05:50:00.194Z",
        revisedField: "spec.impact.isImpacting",
        revisedFrom: "false",
        revisedTo: "true",
      },
      {
        revisionTimestamp: "2024-10-17T05:50:00.194Z",
        revisedField: "spec.impact.isImpacting",
        revisedFrom: "true",
        revisedTo: "false",
      },
    ];

    const expectedOutput = [
      "| Date | Revision |",
      "| --- | --- |",
      "| 10/17/2024 | Advisory is no longer impacting. |",
      "| 10/16/2024 | Advisory is now impacting. |",
    ].join("\n");

    expect(generateRevisionHistory(revisionHistory)).toBe(expectedOutput);
  });

  it("should sort revisions with newest entries at the top", () => {
    const revisionHistory = [
      {
        revisionTimestamp: "2024-10-15T05:50:00.194Z",
        revisedField: "spec.assessment.justification",
        revisedFrom: "",
        revisedTo: "Initial summary",
      },
      {
        revisionTimestamp: "2024-10-17T05:50:00.194Z",
        revisedField: "spec.assessment.justification",
        revisedFrom: "Initial summary",
        revisedTo: "Updated summary",
      },
      {
        revisionTimestamp: "2024-10-16T05:50:00.194Z",
        revisedField: "spec.assessment.justification",
        revisedFrom: "Updated summary",
        revisedTo: "Final summary",
      },
    ];

    const expectedOutput = [
      "| Date | Revision |",
      "| --- | --- |",
      "| 10/17/2024 | Official summary revised: Updated summary |",
      "| 10/16/2024 | Official summary revised: Final summary |",
      "| 10/15/2024 | Official summary added |",
    ].join("\n");

    expect(generateRevisionHistory(revisionHistory)).toBe(expectedOutput);
  });
});
