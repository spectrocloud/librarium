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
  it("should format ISO string date to MM/DD/YYYY with zero-padded month and day", () => {
    const isoString = "2023-09-05T00:00:00Z";
    const formattedDate = formatDateCveDetails(isoString);

    expect(formattedDate).toBe("09/05/2023");
  });

  it("should handle leap years correctly", () => {
    const isoString = "2024-02-29T00:00:00Z";
    const formattedDate = formatDateCveDetails(isoString);

    expect(formattedDate).toBe("02/29/2024");
  });

  it("should return the correct date even with different time zones in the input", () => {
    const isoString = "2023-09-20T15:00:00Z"; // Time zone is UTC but should still give the same day in UTC
    const formattedDate = formatDateCveDetails(isoString);

    expect(formattedDate).toBe("09/20/2023");
  });

  it("should return 'N/A' for an invalid date string", () => {
    const invalidDate = "invalid-date";
    const formattedDate = formatDateCveDetails(invalidDate);

    expect(formattedDate).toBe("N/A");
  });

  it("should return 'N/A' for undefined input", () => {
    const formattedDate = formatDateCveDetails(undefined);

    expect(formattedDate).toBe("N/A");
  });
});
