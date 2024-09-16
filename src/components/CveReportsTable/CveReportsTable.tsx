import React from "react";

export default function CveReportsTable(props) {
  console.log("Props: ", props);

  // const paletteCVEsConnected = props.cves.palette;
  // const paletteCVEsAirgap = props.cves.paletteAirgap;
  // const verteXCVEsConnected = props.cves.vertex;
  // const verteXCVEsAirgap = props.cves.vertexAirgap;

  return (
    <div>
      <h1>CveReportsTable</h1>
      <table>
        <thead>
          <tr>
            <th>CVE</th>
            <th>Severity</th>
            <th>Published Date</th>
            <th>Modified Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>test</td>
            <td>test</td>
            <td>test</td>
            <td>test</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
