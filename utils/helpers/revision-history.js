const { formatDateCveDetails } = require("./date");

function generateRevisionHistory(revisionHistory) {
  if (!Array.isArray(revisionHistory)) {
    console.error("Invalid revisionHistory input. Expected an array.");
    return "";
  }

  const sortedRevisions = revisionHistory.sort((a, b) => new Date(b.revisionTimestamp) - new Date(a.revisionTimestamp));

  // Initialize the table header with consistent spacing
  let tableString = "| Date       | Revision                                |\n";
  tableString += "|------------|-----------------------------------------|\n";

  let hasContent = false;

  sortedRevisions.forEach((revision) => {
    const { revisionTimestamp, revisedField, revisedFrom = "", revisedTo = "" } = revision;
    let itemDescription = "";

    if (revisedField === "spec.assessment.justification") {
      if (revisedFrom === "" && revisedTo !== "") {
        itemDescription = `Official summary added`;
      } else if (revisedFrom !== "" && revisedTo === "") {
        itemDescription = `Official summary removed`;
      } else if (revisedFrom !== "" && revisedTo !== "") {
        itemDescription = `Official summary revised: ${revisedTo}`;
      }
    } else if (revisedField === "metadata.nistSeverity") {
      if (revisedFrom === "UNKNOWN") {
        itemDescription = `Advisory assigned with ${revisedTo} severity`;
      } else if (revisedFrom !== revisedTo) {
        itemDescription = `Advisory severity revised to ${revisedTo} from ${revisedFrom}`;
      }
    } else if (revisedField === "spec.impact.impactedVersions") {
      const formattedFrom = revisedFrom.replace(/\s+/g, ", ").replace(/^\[|\]$/g, "");
      const formattedTo = revisedTo.replace(/\s+/g, ", ").replace(/^\[|\]$/g, "");

      if (revisedFrom === "[]") {
        itemDescription = `Added impacted versions: ${formattedTo}`;
      } else {
        itemDescription = `Impacted versions changed from ${formattedFrom} to ${formattedTo}`;
      }
    } else if (revisedField === "status.status") {
      if (revisedFrom !== revisedTo) {
        itemDescription = `Status changed from ${revisedFrom} to ${revisedTo}`;
      }
    } else if (revisedField === "spec.impact.isImpacting") {
      if (revisedFrom === "false" && revisedTo === "true") {
        itemDescription = "Advisory is now impacting.";
      } else if (revisedFrom === "true" && revisedTo === "false") {
        itemDescription = "Advisory is no longer impacting.";
      }
    }

    // Ensure valid date and description, adding a placeholder if missing
    const formattedDate = formatDateCveDetails(revisionTimestamp) || "N/A";

    // Only add the row if there's valid content to avoid empty lines
    if (itemDescription) {
      tableString += `| ${formattedDate} | ${itemDescription} |\n`;
      hasContent = true;
    }
  });

  // Remove the trailing newline if any before returning
  return hasContent ? tableString.trim() : "";
}

module.exports = { generateRevisionHistory };
