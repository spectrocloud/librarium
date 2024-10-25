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
  metadata: {
    uid: string;
    cve: string;
    summary: string;
    cvssScore: number;
    nistSeverity: string;
    trivySeverity: string;
    grypeSeverity: string;
    cvePublishedTimestamp: string;
    cveLastModifiedTimestamp: string;
    cveLastSeenTimestamp: string;
    advCreatedTimestamp: string;
    advLastModifiedTimestamp: string;
  };
  spec: {
    assessment: {
      impact: string;
      severity: string;
      justification: string;
      thirdParty: {
        dependentPackage: string;
        isDependentOnThirdParty: boolean;
        isUpstreamFixAvailable: boolean;
        dependencyNote: string;
      };
    };
    impact: {
      isImpacting: boolean;
      impactedImageTypes: {
        core: boolean;
      };
      impactedDeployments: {
        airgap: boolean;
        connected: boolean;
      };
      impactedProducts: {
        palette: boolean;
        vertex: boolean;
      };
      impactedImageList: string[];
      impactedComponents: string[];
      impactedVersions: string[];
      technicalDetails: string;
    };
    remediation: {
      isRemediationAvailable: boolean;
      remediationSteps: string;
    };
    revision: any[];
  };
  status: {
    state: string;
    status: string;
  };
}

const isGreater = (a: string, b: string) => {
  return a.localeCompare(b, undefined, { numeric: true }) === 1;
};

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
      dataIndex: ["metadata", "cve"],
      key: "cve",
      sorter: (a, b) => a.metadata.cve.localeCompare(b.metadata.cve),
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
      dataIndex: ["metadata", "cvePublishedTimestamp"],
      key: "publishedDateTime",
      sorter: (a, b) =>
        new Date(a.metadata.cvePublishedTimestamp).getTime() - new Date(b.metadata.cvePublishedTimestamp).getTime(),
      render: (text: string) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Modified Date",
      dataIndex: ["metadata", "cveLastModifiedTimestamp"],
      key: "modifiedDateTime",
      sorter: (a, b) =>
        new Date(a.metadata.cveLastModifiedTimestamp).getTime() -
        new Date(b.metadata.cveLastModifiedTimestamp).getTime(),
      render: (text: string) => new Date(text).toLocaleDateString(),
      defaultSortOrder: "descend",
    },
    {
      title: "Product Version",
      dataIndex: ["spec", "impact", "impactedVersions"],
      key: "productVersion",
      sorter: (a, b) => {
        const isGreater = (a: string, b: string) => a.localeCompare(b, undefined, { numeric: true }) === 1;

        const getSortedVersions = (versions: string[]) => versions.sort((v1, v2) => (isGreater(v1, v2) ? -1 : 1)); // Sort in descending order (newest first)

        const sortedVersionsA = getSortedVersions([...a.spec.impact.impactedVersions]);
        const sortedVersionsB = getSortedVersions([...b.spec.impact.impactedVersions]);

        // Handle cases where either list of impacted versions is empty
        if (sortedVersionsA.length === 0 || sortedVersionsB.length === 0) {
          return sortedVersionsA.length - sortedVersionsB.length;
        }

        // Compare the first (newest) version in the sorted list
        return isGreater(sortedVersionsA[0], sortedVersionsB[0]) ? -1 : 1;
      },
      render: (impactedVersions: string[]) => {
        // Ensure versions are sorted before rendering
        const sortedVersions = impactedVersions.sort((v1, v2) =>
          v1.localeCompare(v2, undefined, { numeric: true }) === 1 ? -1 : 1
        );
        return sortedVersions.length > 0 ? sortedVersions.join(", ") : "N/A";
      },
    },
    {
      title: "Third Party Vulnerability",
      dataIndex: ["spec", "assessment", "thirdParty", "isDependentOnThirdParty"],
      key: "vulnerabilityType",
      render: (record) => (record ? "Yes" : "No"),
    },
    {
      title: "Third Party Package",
      dataIndex: ["spec", "assessment", "thirdParty", "dependentPackage"],
      key: "thirdPartyPackage",
      width: "15%",
      render: (record) => (record ? record : "N/A"),
    },
    {
      title: "CVSS Severity",
      dataIndex: ["metadata", "cvssScore"],
      key: "baseScore",
      sorter: (a, b) => a.metadata.cvssScore - b.metadata.cvssScore,
      render: (baseScore: number, record) => (
        <Link to={`https://nvd.nist.gov/vuln/detail/${record.metadata.cve}`}>{baseScore}</Link>
      ),
    },
    {
      title: "Status",
      key: "status",
      sorter: (a, b) => {
        const statusPriority = (status: string) => {
          // Assign a higher priority to "Open" and "Ongoing", lower to "Fixed" and "Closed"
          if (status === "Open" || status === "Ongoing") return -1;
          if (status === "Fixed" || status === "Closed") return 1;
          return 0; // For safety, though we expect only these four statuses
        };
        return statusPriority(a.status.status) - statusPriority(b.status.status);
      },
      render: (text, record) => {
        const status = record.status.status;
        if (status === "Open" || status === "Ongoing") {
          return <span>🔍 {status}</span>;
        } else if (status === "Fixed" || status === "Closed") {
          return <span>✅ {status}</span>;
        }
        return <span>{status}</span>; // Default case if there are unexpected values
      },
    },
  ];

  // Function to render a table for a specific list of CVEs
  const renderCveTable = (cveList: Cve[]) => (
    <Table
      columns={columns}
      dataSource={cveList}
      rowKey={(record) => record.metadata.uid}
      pagination={{
        pageSizeOptions: ["100", "500", "1000"],
        defaultPageSize: 100,
        showSizeChanger: true,
      }}
      tableLayout="fixed"
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
