const { formatDateCveDetails } = require("./date");

/**
 * Generates a markdown table for revision history, sorted by newest entries first
 * @param {Array<Object>} revisions - An array of revision objects
 * @returns {string} - The markdown table as a string
 */
function generateRevisionHistory(revisions) {
  const headers = ["Date", "Revision"];
  const headerRow = `| ${headers.join(" | ")} |`;
  const separatorRow = `| ${headers.map(() => "---").join(" | ")} |`;

  // Sort revisions by timestamp in descending order
  const sortedRevisions = revisions.sort((a, b) => new Date(b.revisionTimestamp) - new Date(a.revisionTimestamp));

  const rows = sortedRevisions.reduce((acc, { revisionTimestamp, revisedField, revisedFrom, revisedTo }) => {
    const description = getItemDescription(revisedField, revisedFrom, revisedTo);

    // Skip row if no applicable description
    if (!description) return acc;

    const formattedDate = formatDateCveDetails(revisionTimestamp);
    acc.push(`| ${formattedDate} | ${description} |`);
    return acc;
  }, []);

  return `${headerRow}\n${separatorRow}\n${rows.join("\n")}`;
}

/**
 * Generates a description for a revision item based on field, from, and to values
 * @param {string} revisedField - The field that was revised
 * @param {string} revisedFrom - The previous value of the field
 * @param {string} revisedTo - The new value of the field
 * @returns {string} - A human-readable description of the revision
 */
function getItemDescription(revisedField, revisedFrom, revisedTo) {
  let itemDescription = "";

  switch (revisedField) {
    case "spec.assessment.justification":
      if (!revisedFrom && revisedTo) {
        itemDescription = "Official summary added";
      } else if (revisedFrom && !revisedTo) {
        itemDescription = "Official summary removed";
      } else if (revisedFrom && revisedTo) {
        itemDescription = `Official summary revised: ${revisedTo}`;
      }
      break;

    case "metadata.nistSeverity":
      if (revisedFrom === "UNKNOWN") {
        itemDescription = `Advisory assigned with ${revisedTo} severity`;
      } else if (revisedFrom !== revisedTo) {
        itemDescription = `Advisory severity revised to ${revisedTo} from ${revisedFrom}`;
      }
      break;

    // Wraping the case inside a block to address eslint no-case-declarations rule
    case "spec.impact.impactedVersions": {
      const formattedFrom = revisedFrom.replace(/\s+/g, ", ").replace(/^\[|\]$/g, "");
      const formattedTo = revisedTo.replace(/\s+/g, ", ").replace(/^\[|\]$/g, "");

      if (revisedFrom === "[]") {
        itemDescription = `Added impacted versions: ${formattedTo}`;
      } else {
        itemDescription = `Impacted versions changed from ${formattedFrom} to ${formattedTo}`;
      }
      break;
    }

    case "status.status":
      if (revisedFrom !== revisedTo) {
        itemDescription = `Status changed from ${revisedFrom} to ${revisedTo}`;
      }
      break;

    case "spec.impact.isImpacting":
      if (revisedFrom === "false" && revisedTo === "true") {
        itemDescription = "Advisory is now impacting.";
      } else if (revisedFrom === "true" && revisedTo === "false") {
        itemDescription = "Advisory is no longer impacting.";
      }
      break;

    default:
      itemDescription = "";
      break;
  }

  return itemDescription;
}

module.exports = { generateRevisionHistory };
