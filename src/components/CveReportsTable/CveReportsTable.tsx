import React from "react";
import { Tabs, ConfigProvider, Table, theme } from "antd";
import styles from "./CveReportTable.module.scss";
import { useColorMode } from "@docusaurus/theme-common";
import Link from "@docusaurus/Link";
import type { ColumnsType } from "antd/es/table";
import rawData from "../../../.docusaurus/security-bulletins/default/data.json";

interface CveData {
  palette: Cve[];
  paletteAirgap: Cve[];
  vertex: Cve[];
  vertexAirgap: Cve[];
}

interface Cve {
  cve: string;
  publishedDateTime: string;
  modifiedDateTime: string;
  baseScore: number;
  baseSeverity: string;
  packs: string[];
  groups: string[];
  summary: string;
  secSeverity: string;
  isImpacting: boolean;
}

export default function CveReportsTable() {
  const data: CveData = rawData as CveData;

  const paletteCVEsConnected: Cve[] = data?.palette;
  const paletteCVEsAirgap: Cve[] = data?.paletteAirgap;
  const verteXCVEsConnected: Cve[] = data?.vertex;
  const verteXCVEsAirgap: Cve[] = data?.vertexAirgap;

  const { colorMode } = useColorMode();
  const { defaultAlgorithm, darkAlgorithm } = theme;

  const columns: ColumnsType<Cve> = [
    {
      title: "CVE ID",
      dataIndex: "cve",
      key: "cve",
      sorter: (a, b) => a.cve.localeCompare(b.cve),
      render: (cve: string) => (
        <Link
          to={`/security-bulletins/reports/${cve.toLowerCase()}`} // Navigate to the route
          style={{ color: "#1890ff" }} // Add link color
        >
          {cve}
        </Link>
      ),
    },
    {
      title: "Initial Pub Date",
      dataIndex: "publishedDateTime",
      key: "publishedDateTime",
      sorter: (a, b) => new Date(a.publishedDateTime).getTime() - new Date(b.publishedDateTime).getTime(),
      render: (text: string) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Modified Date",
      dataIndex: "modifiedDateTime",
      key: "modifiedDateTime",
      sorter: (a, b) => new Date(a.modifiedDateTime).getTime() - new Date(b.modifiedDateTime).getTime(),
      render: (text: string) => new Date(text).toLocaleDateString(),
      defaultSortOrder: "descend",
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
    {
      title: "CVSS Severity",
      dataIndex: "baseScore",
      key: "baseScore",
      sorter: (a, b) => a.baseScore - b.baseScore,
      render: (baseScore: number, record) => (
        <Link to={`https://nvd.nist.gov/vuln/detail/${record.cve}`}>{baseScore}</Link>
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
  const renderCveTable = (cveList: Cve[]) => (
    <Table
      columns={columns}
      dataSource={cveList}
      rowKey="cve"
      pagination={{
        pageSizeOptions: ["100", "500", "1000"],
        defaultPageSize: 100,
        showSizeChanger: true,
      }}
    />
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
