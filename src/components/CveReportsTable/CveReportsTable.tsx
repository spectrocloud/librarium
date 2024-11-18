import React, { useState, useEffect, useMemo } from "react";
import { Tabs, ConfigProvider, Table, theme, Spin } from "antd";
import { useColorMode } from "@docusaurus/theme-common";
import Link from "@docusaurus/Link";
import type { ColumnsType } from "antd/es/table";
import Admonition from "@theme/Admonition";
import styles from "./CveReportTable.module.scss";
import semver from "semver";

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
    advCreatedTimestamp: string;
  };
  spec: {
    impact: {
      impactedVersions: string[];
    };
  };
  status: {
    status: string;
  };
}

// Reduced interface for minimized CVE data
interface MinimizedCve {
  metadata: {
    uid: string;
    cve: string;
    cvssScore: number;
    cvePublishedTimestamp: string;
    cveLastModifiedTimestamp: string;
  };
  spec: {
    impact: {
      impactedVersions: string[];
    };
  };
  status: {
    status: string;
  };
}

// Define a union type to handle both full and minimized data structures
type CveDataUnion =
  | CveData
  | { palette: MinimizedCve[]; paletteAirgap: MinimizedCve[]; vertex: MinimizedCve[]; vertexAirgap: MinimizedCve[] };

export default function CveReportsTable() {
  const [data, setData] = useState<CveDataUnion | null>(null);
  const [loading, setLoading] = useState(true);
  const { colorMode } = useColorMode();
  const { defaultAlgorithm, darkAlgorithm } = theme;

  useEffect(() => {
    // Attempt at reducing memory foot print (fingers crossed)
    const minimizeData = (entry: Cve): MinimizedCve => ({
      metadata: {
        uid: entry.metadata.uid,
        cve: entry.metadata.cve,
        cvssScore: entry.metadata.cvssScore,
        cvePublishedTimestamp: entry.metadata.cvePublishedTimestamp,
        cveLastModifiedTimestamp: entry.metadata.cveLastModifiedTimestamp,
      },
      spec: { impact: { impactedVersions: entry.spec.impact.impactedVersions } },
      status: { status: entry.status.status },
    });

    const loadData = async () => {
      try {
        const response = await import("../../../.docusaurus/security-bulletins/default/data.json");
        const reducedData = {
          palette: response.palette.map(minimizeData),
          paletteAirgap: response.paletteAirgap.map(minimizeData),
          vertex: response.vertex.map(minimizeData),
          vertexAirgap: response.vertexAirgap.map(minimizeData),
        };
        setData(reducedData); // `reducedData` matches the `MinimizedCve` type
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData().catch((error) => console.error("Error loading data:", error));
  }, []);

  const columns: ColumnsType<MinimizedCve> = useMemo(
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
          const versionsA = a.spec.impact.impactedVersions.sort(semver.compare).reverse();
          const versionsB = b.spec.impact.impactedVersions.sort(semver.compare).reverse();
          return semver.compare(versionsB[0] || "0.0.0", versionsA[0] || "0.0.0"); // compare the highest version
        },
        render: (impactedVersions: string[]) => {
          // Sort versions semantically and limit to the top 3
          const sortedVersions = impactedVersions.sort(semver.compare).reverse().slice(0, 3);
          // Join versions with comma and add ellipsis if there are more than 3
          return sortedVersions.join(", ") + (impactedVersions.length > 3 ? ", ..." : "");
        },
      },
      {
        title: "Status",
        key: "status",
        sorter: (a, b) => a.status.status.localeCompare(b.status.status),
        render: (record: MinimizedCve) => {
          const status = record.status.status;
          return status === "Open" || status === "Ongoing" ? <span>🔍 {status}</span> : <span>✅ {status}</span>;
        },
      },
    ],
    []
  );

  const renderCveTable = (cveList: MinimizedCve[]) => (
    <div className={styles.tableContainer}>
      <Table
        columns={columns}
        dataSource={cveList}
        rowKey={(record) => record.metadata.uid}
        pagination={{
          pageSizeOptions: ["25", "50", "100", "500", "1000"],
          defaultPageSize: 100,
          showSizeChanger: true,
        }}
        virtual
        scroll={{ y: 800 }}
        bordered={true}
        tableLayout="fixed"
      />
    </div>
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
          <Tabs defaultActiveKey="1" items={tabs} destroyInactiveTabPane type="card" />
        </div>
      </ConfigProvider>
    </div>
  );
}
