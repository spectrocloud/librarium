import React, { useState, useEffect } from "react";
import { Tabs, ConfigProvider, Table, theme } from "antd";
import styles from "./CveReportTable.module.scss";
import { useColorMode } from "@docusaurus/theme-common";
import Link from "@docusaurus/Link";
import type { ColumnsType } from "antd/es/table";
import rawData from "../../../.docusaurus/security-bulletins/default/data.json";
import { Spin } from "antd";

interface CveData {
  palette: Cve[];
  paletteAirgap: Cve[];
  vertex: Cve[];
  vertexAirgap: Cve[];
}

// The interface maps to the return payload from the API https://dso.teams.spectrocloud.com/v1/advisories
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

export default function CveReportsTable() {
  const data: CveData = rawData as CveData;
  const [loading, setLoading] = useState(true);

  const paletteCVEsConnected: Cve[] = data?.palette;
  const paletteCVEsAirgap: Cve[] = data?.paletteAirgap;
  const verteXCVEsConnected: Cve[] = data?.vertex;
  const verteXCVEsAirgap: Cve[] = data?.vertexAirgap;

  const { colorMode } = useColorMode();
  const { defaultAlgorithm, darkAlgorithm } = theme;

  useEffect(() => {
    // I'm (Karl) only using this to simulate a loading state
    // The main reason is to show the loading spinner
    // If we don't do this then when a user navigates to this page or refreshes the page
    // It's possible the CSS is not loaded yet and the table styles are not applied resulting in a bad UX
    // This is a workaround to show the loading spinner until the CSS is loaded
    const timer = setTimeout(() => setLoading(false), 0);
    return () => clearTimeout(timer);
  }, []);

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
        const getSortedVersions = (versions: string[]) => versions.sort((v1, v2) => (isGreater(v1, v2) ? -1 : 1));

        const sortedVersionsA = getSortedVersions([...a.spec.impact.impactedVersions]);
        const sortedVersionsB = getSortedVersions([...b.spec.impact.impactedVersions]);

        if (sortedVersionsA.length === 0 || sortedVersionsB.length === 0) {
          return sortedVersionsA.length - sortedVersionsB.length;
        }

        return isGreater(sortedVersionsA[0], sortedVersionsB[0]) ? -1 : 1;
      },
      render: (impactedVersions: string[]) => {
        const sortedVersions = impactedVersions.sort((v1, v2) =>
          v1.localeCompare(v2, undefined, { numeric: true }) === 1 ? -1 : 1
        );

        // Show only the first 3 versions, followed by an ellipsis if there are more otherwise things look rough
        const displayedVersions = sortedVersions.slice(0, 3).join(", ");
        return sortedVersions.length > 3 ? `${displayedVersions}, ...` : displayedVersions || "N/A";
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
          if (status === "Open" || status === "Ongoing") return -1;
          if (status === "Fixed" || status === "Closed") return 1;
          return 0;
        };
        return statusPriority(a.status.status) - statusPriority(b.status.status);
      },
      render: (record) => {
        const status = record.status.status;
        if (status === "Open" || status === "Ongoing") {
          return <span>🔍 {status}</span>;
        } else if (status === "Fixed" || status === "Closed") {
          return <span>✅ {status}</span>;
        }
        return <span>{status}</span>;
      },
    },
  ];

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

  const tabs = [
    { label: "Palette Enterprise", key: "1", children: renderCveTable(paletteCVEsConnected) },
    { label: "Palette Enterprise Airgap", key: "2", children: renderCveTable(paletteCVEsAirgap) },
    { label: "VerteX", key: "3", children: renderCveTable(verteXCVEsConnected) },
    { label: "VerteX Airgap", key: "4", children: renderCveTable(verteXCVEsAirgap) },
  ];

  return (
    <div className={styles.tabPane}>
      <ConfigProvider theme={{ algorithm: colorMode === "dark" ? darkAlgorithm : defaultAlgorithm }}>
        {loading ? (
          <Spin
            size="large"
            style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100px" }}
          />
        ) : (
          <Tabs defaultActiveKey="1">
            {tabs.map((tab) => (
              <Tabs.TabPane tab={tab.label} key={tab.key}>
                {tab.children}
              </Tabs.TabPane>
            ))}
          </Tabs>
        )}
      </ConfigProvider>
    </div>
  );
}
