import React from "react";
import { Tabs, ConfigProvider, Table, theme } from "antd";
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

  // Columns configuration for sorting
  const columns = [
    {
      title: "CVE ID",
      dataIndex: "cve",
      key: "cve",
      sorter: (a, b) => a.cve.localeCompare(b.cve),
    },
    {
      title: "Initial Pub Date",
      dataIndex: "publishedDateTime",
      key: "publishedDateTime",
      sorter: (a, b) => new Date(a.publishedDateTime) - new Date(b.publishedDateTime),
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Modified Date",
      dataIndex: "modifiedDateTime",
      key: "modifiedDateTime",
      sorter: (a, b) => new Date(a.modifiedDateTime) - new Date(b.modifiedDateTime),
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Product Version",
      dataIndex: "productVersion",
      key: "productVersion",
      render: () => "N/A",
    },
    {
      title: "Vulnerability Type",
      dataIndex: "vulnerabilityType",
      key: "vulnerabilityType",
      render: () => "N/A",
    },
    // {
    //   title: "CVSS Severity",
    //   dataIndex: "baseScore",
    //   key: "baseScore",
    //   sorter: (a, b) => a.baseScore - b.baseScore,
    //   render: (score) => (
    //     <a href={`https://nvd.nist.gov/vuln/detail/${score}`} target="_blank" rel="noopener noreferrer">
    //       {score}
    //     </a>
    //   ),
    // },
    {
      title: "CVSS Severity",
      dataIndex: "baseScore",
      key: "baseScore",
      sorter: (a, b) => a.baseScore - b.baseScore,
      render: (baseScore, record) => (
        <a href={`https://nvd.nist.gov/vuln/detail/${record.cve}`} target="_blank" rel="noopener noreferrer">
          {baseScore}
        </a>
      ),
    },
    {
      title: "Status",
      key: "status",
      sorter: (a, b) => (a.isImpacting === b.isImpacting ? 0 : a.isImpacting ? -1 : 1),
      render: (text, record) => (record.isImpacting ? <span>🔍 Ongoing</span> : <span>✅ Resolved</span>),
    },
  ];

  // Function to render a table for a specific list of CVEs
  const renderCveTable = (cveList) => <Table columns={columns} dataSource={cveList} rowKey="cve" pagination={false} />;

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
