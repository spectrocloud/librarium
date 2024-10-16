function generateMarkdownTable(impactData, versions, productMap) {
  // Check if all products are false
  const allProductsFalse = Object.values(impactData).every((value) => value === false);

  // If all products are false, return a specific message
  if (allProductsFalse) {
    return "Investigation is ongoing to determine how this vulnerability affects our products.";
  }

  // If any product is true but there are no versions, throw an error
  const anyProductTrue = Object.values(impactData).some((value) => value === true);
  if (anyProductTrue && versions.length === 0) {
    throw new Error("Error: Data inconsistency - Products impacted but no versions provided.");
  }

  // Create the header row dynamically based on the product map
  let header = "| | " + Object.values(productMap).join(" | ") + " |\n";
  let separator =
    "|-|" +
    Object.keys(productMap)
      .map(() => "--------")
      .join("|") +
    "|\n";

  // Create the rows for each version
  let rows = versions
    .map((version) => {
      let row = `| ${version} | `;
      row += Object.keys(productMap)
        .map((product) => {
          return impactData[product] ? "Impacted" : "No Impact";
        })
        .join(" | ");
      return row + " |";
    })
    .join("\n");

  return header + separator + rows;
}

module.exports = { generateMarkdownTable };
