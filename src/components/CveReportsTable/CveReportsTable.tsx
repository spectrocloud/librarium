import React from "react";
import Link from "@docusaurus/Link";

export default function CveReportsTable() {
  const data = require("../../../.docusaurus/security-bulletins/default/data.json");
  console.log(data);
  const paletteCVEsConnected = data?.palette;
  const paletteCVEsAirgap = data?.paletteAirgap;
  const verteXCVEsConnected = data?.vertex;
  const verteXCVEsAirgap = data?.vertexAirgap;

  const allCves = [...paletteCVEsConnected, ...paletteCVEsAirgap, ...verteXCVEsConnected, ...verteXCVEsAirgap];

  return (
    <div>
      <h1>CVE Reports Table</h1>
      <table>
        <thead>
          <tr>
            <th>CVE ID</th>
            <th>Initial Pub Date</th>
            <th>Modified Date</th>
            <th>Product Version</th>
            <th>Vulnerability Type</th>
            <th>CVSS Severity </th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {allCves.map((cveData, index) => (
            <tr key={index}>
              <td>{cveData.cve}</td>
              <td>{new Date(cveData.publishedDateTime).toLocaleDateString()}</td>
              <td>{new Date(cveData.modifiedDateTime).toLocaleDateString()}</td>
              <td>N/A</td>
              <td>N/A</td>
              <td>
                <a href={`https://nvd.nist.gov/vuln/detail/${cveData.cve}`} target="_blank" rel="noopener noreferrer">
                  {cveData.baseScore}
                </a>
              </td>
              <td>{cveData.isImpacting ? <span>🔍 Ongoing</span> : <span>✅ Resolved</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
