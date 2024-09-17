function getFormattedDate() {
  const options = { timeZone: "America/Los_Angeles", year: "numeric", month: "2-digit", day: "2-digit" };
  const formattedDate = new Date().toLocaleDateString("en-CA", options);
  return formattedDate;
}

export { getFormattedDate };
