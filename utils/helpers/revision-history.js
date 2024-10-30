const { formatDateCveDetails } = require("./date");

function generateRevisionHistory(revisionHistory) {
  const sortedRevisions = revisionHistory.sort((a, b) => new Date(b.revisionTimestamp) - new Date(a.revisionTimestamp));

  let tableString = "| Date       | Revision                   |\n";
  tableString += "|------------|----------------------------|\n";

  let hasContent = false;

  sortedRevisions.forEach((revision) => {
    const { revisionTimestamp, revisedField, revisedFrom, revisedTo } = revision;
    let itemDescription = "";

    // Justification field logic
    if (revisedField === "spec.assessment.justification") {
      if (revisedFrom === "" && revisedTo !== "") {
        itemDescription = `Official summary added`;
      } else if (revisedFrom !== "" && revisedTo === "") {
        itemDescription = `Official summary removed`;
      } else if (revisedFrom !== "" && revisedTo !== "") {
        itemDescription = `Official summary revised: ${revisedTo}`;
      }
    }

    // NIST severity change logic
    if (revisedField === "metadata.nistSeverity") {
      if (revisedFrom === "UNKNOWN") {
        itemDescription = `Advisory assigned with ${revisedTo} severity`;
      } else if (revisedFrom !== revisedTo) {
        itemDescription = `Advisory severity revised to ${revisedTo} from ${revisedFrom}`;
      }
    }

    // Impacted versions logic
    if (revisedField === "spec.impact.impactedVersions") {
      const formattedFrom = revisedFrom.replace(/\s+/g, ", ").replace(/^\[|\]$/g, "");
      const formattedTo = revisedTo.replace(/\s+/g, ", ").replace(/^\[|\]$/g, "");

      if (revisedFrom === "[]") {
        itemDescription = `Added impacted versions: ${formattedTo}`;
      } else {
        itemDescription = `Impacted versions changed from ${formattedFrom} to ${formattedTo}`;
      }
    }

    // Status change logic
    if (revisedField === "status.status") {
      if (revisedFrom !== revisedTo) {
        itemDescription = `Status changed from ${revisedFrom} to ${revisedTo}`;
      }
    }

    // isImpacting field logic
    if (revisedField === "spec.impact.isImpacting") {
      if (revisedFrom === "false" && revisedTo === "true") {
        itemDescription = "Advisory is now impacting.";
      } else if (revisedFrom === "true" && revisedTo === "false") {
        itemDescription = "Advisory is no longer impacting.";
      }
    }

    // If there's a description, add it to the table as a markdown row so we can display it.
    if (itemDescription) {
      const formattedDate = formatDateCveDetails(revisionTimestamp);
      tableString += `| ${formattedDate} | ${itemDescription} |\n`;
      hasContent = true;
    }
  });

  return hasContent ? tableString.trim() : "";
}

module.exports = { generateRevisionHistory };
