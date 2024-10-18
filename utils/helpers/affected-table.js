function generateMarkdownTable(impactData, versions, productMap, impactedDeployments) {
  // Create the header row dynamically based on the product map
  let header =
    "| Versions | " +
    Object.values(productMap)
      .flatMap((product) => [`${product} (Airgap)`, `${product} (Connected)`])
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
