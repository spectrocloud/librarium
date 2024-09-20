const { getTodayFormattedDate, formatDateCveDetails } = require("./date");

describe("getTodayFormattedDate", () => {
  it("should return today's date formatted as YYYY-MM-DD in America/Los_Angeles timezone", () => {
    const options = { timeZone: "America/Los_Angeles", year: "numeric", month: "2-digit", day: "2-digit" };
    const expectedDate = new Date().toLocaleDateString("en-CA", options);

    expect(getTodayFormattedDate()).toBe(expectedDate);
  });

  it("should return the date in YYYY-MM-DD format", () => {
    const formattedDate = getTodayFormattedDate();
    expect(formattedDate).toMatch(/^\d{4}-\d{2}-\d{2}$/); // Check for correct format
  });
});

describe("formatDateCveDetails", () => {
  it("should format ISO string date to M/D/YYYY", () => {
    const isoString = "2023-09-20T00:00:00Z";
    const formattedDate = formatDateCveDetails(isoString);

    expect(formattedDate).toBe("9/20/2023");
  });

  it("should handle leap years correctly", () => {
    const isoString = "2024-02-29T00:00:00Z";
    const formattedDate = formatDateCveDetails(isoString);

    expect(formattedDate).toBe("2/29/2024");
  });

  it("should return the correct date even with different time zones in the input", () => {
    const isoString = "2023-09-20T15:00:00Z"; // Time zone is UTC but should still give same day for UTC date
    const formattedDate = formatDateCveDetails(isoString);

    expect(formattedDate).toBe("9/20/2023");
  });
});
