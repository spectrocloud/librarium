function getTodayFormattedDate() {
  const options = { timeZone: "America/Los_Angeles", year: "numeric", month: "2-digit", day: "2-digit" };
  const formattedDate = new Date().toLocaleDateString("en-CA", options);
  return formattedDate;
}

function formatDateCveDetails(isoString) {
  const date = new Date(isoString);
  const month = date.getUTCMonth() + 1; // Months are zero-based, so we add 1
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();

  return `${month}/${day}/${year}`;
}

module.exports = { getTodayFormattedDate, formatDateCveDetails };
