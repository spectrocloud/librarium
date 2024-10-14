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

const compareSemVer = (versionA: string, versionB: string) => {
  const parseVersion = (version: string) => version.split(".").map((num) => parseInt(num, 10));

  const [majorA, minorA, patchA] = parseVersion(versionA);
  const [majorB, minorB, patchB] = parseVersion(versionB);

  if (majorA !== majorB) return majorA - majorB;
  if (minorA !== minorB) return minorA - minorB;
  return patchA - patchB;
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
        // If either has no version, treat as equal or move the one with versions first
        if (!a.spec.impact.impactedVersions.length || !b.spec.impact.impactedVersions.length) {
          return a.spec.impact.impactedVersions.length - b.spec.impact.impactedVersions.length;
        }

        // Assuming each CVE only impacts a single version (taking the first impacted version for sorting)
        return compareSemVer(a.spec.impact.impactedVersions[0], b.spec.impact.impactedVersions[0]);
      },
      render: (impactedVersions: string[]) => (impactedVersions.length > 0 ? impactedVersions.join(", ") : "N/A"),
    },
    {
      title: "Vulnerability Type",
      dataIndex: "vulnerabilityType",
      key: "vulnerabilityType",
      render: () => "N/A", // Assuming this field is not in the data
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
