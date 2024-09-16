import React from "react";
import { Tabs, ConfigProvider, theme } from "antd";
import styles from "./CveReportTable.module.scss";
import { useColorMode } from "@docusaurus/theme-common";

export default function CveReportsTable() {
  const data = require("../../../.docusaurus/security-bulletins/default/data.json");

  const paletteCVEsConnected = data?.palette;
  const paletteCVEsAirgap = data?.paletteAirgap;
  const verteXCVEsConnected = data?.vertex;
  const verteXCVEsAirgap = data?.vertexAirgap;

  const { colorMode } = useColorMode();
  const { defaultAlgorithm, darkAlgorithm } = theme;

  // Function to render a table for a specific list of CVEs
  const renderCveTable = (cveList) => (
    <table>
      <thead>
        <tr>
          <th>CVE ID</th>
          <th>Initial Pub Date</th>
          <th>Modified Date</th>
          <th>Product Version</th>
          <th>Vulnerability Type</th>
          <th>CVSS Severity</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {cveList.map((cveData, index) => (
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
  );

  // Tabs content data
  const tabs = [
    { label: "Palette Enterprise", key: "1", children: renderCveTable(paletteCVEsConnected) },
    { label: "Palette Enterprise Airgap", key: "2", children: renderCveTable(paletteCVEsAirgap) },
    { label: "VerteX", key: "3", children: renderCveTable(verteXCVEsConnected) },
    { label: "VerteX Airgap", key: "4", children: renderCveTable(verteXCVEsAirgap) },
  ];

  return (
    <div className={styles.tabPane}>
      <ConfigProvider theme={{ algorithm: colorMode === "dark" ? darkAlgorithm : defaultAlgorithm }}>
        <Tabs defaultActiveKey="1">
          {tabs.map((tab) => (
            <Tabs.TabPane tab={tab.label} key={tab.key}>
              {tab.children}
            </Tabs.TabPane>
          ))}
        </Tabs>
      </ConfigProvider>
    </div>
  );
}
