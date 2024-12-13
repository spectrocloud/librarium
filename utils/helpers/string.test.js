const { escapeMDXSpecialChars } = require("./string");

describe("escapeMDXSpecialChars", () => {
  it("should escape all special MDX characters", () => {
    const input = "\\ { } ` < >";
    const expectedOutput = "\\\\ \\{ \\} \\` \\< \\>";

    expect(escapeMDXSpecialChars(input)).toBe(expectedOutput);
  });

  it("should handle strings without special characters", () => {
    const input = "Hello World";
    const expectedOutput = "Hello World";

    expect(escapeMDXSpecialChars(input)).toBe(expectedOutput);
  });

  it("should return an empty string if input is not a string", () => {
    expect(escapeMDXSpecialChars(null)).toBe("");
    expect(escapeMDXSpecialChars(123)).toBe("");
    expect(escapeMDXSpecialChars({})).toBe("");
    expect(escapeMDXSpecialChars([])).toBe("");
    expect(escapeMDXSpecialChars(undefined)).toBe("");
  });

  it("should escape only MDX special characters and leave others intact", () => {
    const input = "Hello {world} <this> is a `test` \\ string!";
    const expectedOutput = "Hello \\{world\\} \\<this\\> is a \\`test\\` \\\\ string!";

    expect(escapeMDXSpecialChars(input)).toBe(expectedOutput);
  });

  it("should handle a string with only backslashes correctly", () => {
    const input = "\\\\";
    const expectedOutput = "\\\\\\\\";

    expect(escapeMDXSpecialChars(input)).toBe(expectedOutput);
  });

  it("should escape MDX special characters when they appear multiple times", () => {
    const input = "{}{}<<>>``";
    const expectedOutput = "\\{\\}\\{\\}\\<\\<\\>\\>\\`\\`";

    expect(escapeMDXSpecialChars(input)).toBe(expectedOutput);
  });

  it("should handle an empty string input", () => {
    expect(escapeMDXSpecialChars("")).toBe("");
  });

  it("should not modify numeric characters or punctuation marks other than MDX special characters", () => {
    const input = "12345 ,.!? ";
    const expectedOutput = "12345 ,.!? ";

    expect(escapeMDXSpecialChars(input)).toBe(expectedOutput);
  });
});
