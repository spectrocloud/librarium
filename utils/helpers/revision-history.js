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

  // Sort revisions by timestamp in descending order, only if revisions array is not empty
  const sortedRevisions = revisions.length
    ? [...revisions].sort((a, b) => new Date(b.revisionTimestamp) - new Date(a.revisionTimestamp))
    : [];

  const rows = sortedRevisions.reduce((acc, { revisionTimestamp, revisedField, revisedFrom, revisedTo }) => {
    const description = getItemDescription(revisedField, revisedFrom, revisedTo);

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
      itemDescription = getJustificationDescription(revisedFrom, revisedTo);
      break;

    case "metadata.nistSeverity":
      itemDescription = getSeverityDescription(revisedFrom, revisedTo);
      break;

    case "spec.impact.impactedVersions":
      itemDescription = getImpactedVersionsDescription(revisedFrom, revisedTo);
      break;

    case "status.status":
      itemDescription = revisedFrom !== revisedTo ? `Status changed from ${revisedFrom} to ${revisedTo}` : "";
      break;

    case "spec.impact.isImpacting":
      itemDescription =
        revisedFrom === "false" && revisedTo === "true"
          ? "Advisory is now impacting."
          : revisedFrom === "true" && revisedTo === "false"
            ? "Advisory is no longer impacting."
            : "";
      break;

    default:
      return ""; // Return early if no matching case
  }

  return itemDescription;
}

function getJustificationDescription(revisedFrom, revisedTo) {
  if (!revisedFrom && revisedTo) return "Official summary added";
  if (revisedFrom && !revisedTo) return "Official summary removed";
  if (revisedFrom && revisedTo) return `Official summary revised: ${revisedTo}`;
  return "";
}

function getSeverityDescription(revisedFrom, revisedTo) {
  if (revisedFrom === "UNKNOWN") return `Advisory assigned with ${revisedTo} severity`;
  if (revisedFrom !== revisedTo) return `Advisory severity revised to ${revisedTo} from ${revisedFrom}`;
  return "";
}

function getImpactedVersionsDescription(revisedFrom, revisedTo) {
  const formattedFrom = formatArray(revisedFrom);
  const formattedTo = formatArray(revisedTo);

  return revisedFrom === "[]"
    ? `Added impacted versions: ${formattedTo}`
    : `Impacted versions changed from ${formattedFrom} to ${formattedTo}`;
}

function formatArray(value) {
  return value.replace(/\s+/g, ", ").replace(/^\[|\]$/g, "");
}

module.exports = { generateRevisionHistory };
