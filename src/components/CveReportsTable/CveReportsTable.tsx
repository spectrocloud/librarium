import React, { useState, useEffect, useMemo } from "react";
import { Tabs, ConfigProvider, Table, theme, Spin } from "antd";
import { useColorMode } from "@docusaurus/theme-common";
import Link from "@docusaurus/Link";
import type { ColumnsType } from "antd/es/table";
import Admonition from "@theme/Admonition";
import styles from "./CveReportTable.module.scss";

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

export default function CveReportsTable() {
  const [data, setData] = useState<CveData | null>(null);
  const [loading, setLoading] = useState(true);
  const { colorMode } = useColorMode();
  const { defaultAlgorithm, darkAlgorithm } = theme;

  useEffect(() => {
    const loadData = async () => {
      const response = await import("../../../.docusaurus/security-bulletins/default/data.json");
      setData(response as CveData);
      setLoading(false);
    };
    loadData();
  }, []);

  const columns: ColumnsType<Cve> = useMemo(
    () => [
      {
        title: "CVE ID",
        dataIndex: ["metadata", "cve"],
        key: "cve",
        sorter: (a, b) => a.metadata.cve.localeCompare(b.metadata.cve),
        render: (cve: string, record) => (
          <Link to={`/security-bulletins/reports/${record.metadata.uid.toLowerCase()}`} style={{ color: "#1890ff" }}>
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
          const displayedVersions = sortedVersions.slice(0, 3).join(", ");
          return sortedVersions.length > 3 ? `${displayedVersions}, ...` : displayedVersions || "N/A";
        },
      },
      {
        title: "Third Party Vulnerability",
        dataIndex: ["spec", "assessment", "thirdParty", "isDependentOnThirdParty"],
        key: "vulnerabilityType",
        sorter: (a, b) => {
          const valueA = a.spec.assessment.thirdParty.isDependentOnThirdParty ? 1 : 0;
          const valueB = b.spec.assessment.thirdParty.isDependentOnThirdParty ? 1 : 0;
          return valueB - valueA;
        },
        render: (isDependentOnThirdParty) => {
          if (isDependentOnThirdParty === true) return "Yes";
          if (isDependentOnThirdParty === false) return "No";
          return "N/A";
        },
      },
      {
        title: "Third Party Package",
        dataIndex: ["spec", "assessment", "thirdParty", "dependentPackage"],
        key: "thirdPartyPackage",
        width: "15%",
        render: (record: string) => (record ? record : "N/A"),
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
        render: (record: Cve) => {
          const status = record.status.status;
          if (status === "Open" || status === "Ongoing") {
            return <span>🔍 {status}</span>;
          } else if (status === "Fixed" || status === "Closed") {
            return <span>✅ {status}</span>;
          }
          return <span>{status}</span>;
        },
      },
    ],
    []
  );

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

  const tabs = useMemo(
    () => [
      { label: "Palette Enterprise", key: "1", children: renderCveTable(data?.palette || []) },
      { label: "Palette Enterprise Airgap", key: "2", children: renderCveTable(data?.paletteAirgap || []) },
      { label: "VerteX", key: "3", children: renderCveTable(data?.vertex || []) },
      { label: "VerteX Airgap", key: "4", children: renderCveTable(data?.vertexAirgap || []) },
    ],
    [data]
  );

  if (loading) {
    return (
      <Spin size="large" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100px" }} />
    );
  }

  return (
    <div className={styles.tabPane}>
      <ConfigProvider theme={{ algorithm: colorMode === "dark" ? darkAlgorithm : defaultAlgorithm }}>
        <div className={styles.unsupportedMessage}>
          <Admonition type="warning" title="Unsupported Display Size">
            The current screen size is not supported. Use a larger display to access the CVE table.
          </Admonition>
        </div>
        <div className={styles.tableContainer}>
          <Tabs defaultActiveKey="1" items={tabs} />
        </div>
      </ConfigProvider>
    </div>
  );
}
