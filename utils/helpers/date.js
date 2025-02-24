function getTodayFormattedDate() {
  const options = { timeZone: "America/Los_Angeles", year: "numeric", month: "2-digit", day: "2-digit" };
  const formattedDate = new Date().toLocaleDateString("en-CA", options);
  return formattedDate;
}

function formatDateCveDetails(isoString) {
  const date = new Date(isoString);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    console.warn(`Invalid date string: ${isoString}`);
    return "N/A"; // or an appropriate placeholder for invalid dates
  }

  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Pad month to 2 digits
  const day = String(date.getUTCDate()).padStart(2, "0"); // Pad day to 2 digits
  const year = date.getUTCFullYear();

  return `${month}/${day}/${year}`;
}

module.exports = { getTodayFormattedDate, formatDateCveDetails };
