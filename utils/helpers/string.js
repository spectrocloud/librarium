function escapeMDXSpecialChars(str) {
  if (typeof str !== "string") {
    return "";
  }

  // Escape special MDX characters by adding a backslash in front of them
  return str
    .replace(/\\/g, "\\\\") // Escape backslash
    .replace(/{/g, "\\{") // Escape opening curly brace
    .replace(/}/g, "\\}") // Escape closing curly brace
    .replace(/`/g, "\\`") // Escape backticks
    .replace(/</g, "\\<") // Escape less-than sign
    .replace(/>/g, "\\>"); // Escape greater-than sign
}

module.exports = { escapeMDXSpecialChars };
