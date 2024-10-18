function generateMarkdownTable(impactData, versions, productMap, impactedDeployments) {
  // Check if all products are false
  const allProductsFalse = Object.values(impactData).every((value) => value === false);

  // If all products are false, return a specific message
  if (allProductsFalse) {
    return "Investigation is ongoing to determine how this vulnerability affects our products";
  }

  // If any product is true but there are no versions, throw an error
  const anyProductTrue = Object.values(impactData).some((value) => value === true);
  if (anyProductTrue && versions.length === 0) {
    throw new Error("Error: Data inconsistency - Products impacted but no versions provided.");
  }

  // Create the header row dynamically based on the product map
  let header =
    "| Versions | " +
    Object.values(productMap)
      .flatMap((product) => [`${product} Airgap`, `${product}`])
      .join(" | ") +
    " |\n";
  let separator =
    "|-|" +
    Object.keys(productMap)
      .flatMap(() => ["--------", "--------"])
      .join("|") +
    "|\n";

  // Create the rows for each version
  let rows = versions
    .map((version) => {
      let row = `| ${version} | `;
      row += Object.keys(productMap)
        .flatMap((product) => {
          let airgapStatus = impactedDeployments.airgap && impactData[product] ? "Impacted" : "No Impact";
          let connectedStatus = impactedDeployments.connected && impactData[product] ? "Impacted" : "No Impact";
          return [airgapStatus, connectedStatus];
        })
        .join(" | ");
      return row + " |";
    })
    .join("\n");

  return header + separator + rows;
}

// Example usage
let impactData = { palette: true, vertex: false };
let versions = ["4.4.20", "4.5.3"];
let productMap = { palette: "Palette", vertex: "VerteX" };
let impactedDeployments = { airgap: false, connected: true };

console.log(generateMarkdownTable(impactData, versions, productMap, impactedDeployments));

module.exports = { generateMarkdownTable };
