import React, { useState, useEffect, useMemo } from "react";
import { Tabs, ConfigProvider, Table, theme, Spin } from "antd";
import { useColorMode } from "@docusaurus/theme-common";
import useIsBrowser from "@docusaurus/useIsBrowser";
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
    advLastModifiedTimestamp: string;
  };
  spec: {
    assessment: {
      thirdParty: {
        isDependentOnThirdParty: boolean;
      };
    };
    impact: {
      impactedVersions: string[];
    };
  };
  status: {
    status: string;
  };
}

interface MinimizedCve {
  metadata: {
    uid: string;
    cve: string;
    cvssScore: number;
    cvePublishedTimestamp: string;
    cveLastModifiedTimestamp: string;
    advLastModifiedTimestamp: string;
  };
  spec: {
    assessment: {
      thirdParty: {
        isDependentOnThirdParty: boolean;
      };
    };
    impact: {
      impactedVersions: string[];
    };
  };
  status: {
    status: string;
  };
}

type CveDataUnion =
  | CveData
  | {
      palette: MinimizedCve[];
      paletteAirgap: MinimizedCve[];
      vertex: MinimizedCve[];
      vertexAirgap: MinimizedCve[];
    };

// generateCVEOfficialDetailsUrl returns a URL that is used to link to the official CVE report.
// The URL is generated based on the cveId.
// The function checks if the cveId starts with "ghsa" and returns a GitHub Security Advisory URL. Other formal sites can be added in the future.
// The default URL is the NVD official CVE report.
function generateCVEOfficialDetailsUrl(cveId: string) {
  let url;

  // If cveId is empty, return the default reports page URL
  if (!cveId) {
    return "/security-bulletins/reports/";
  }

  switch (true) {
    // GitHub Security Advisory
    case cveId.toLocaleLowerCase().startsWith("ghsa"):
      url = `https://github.com/advisories/${cveId.toLocaleLowerCase()}`;
      break;
    // Default CVE URL
    default:
      url = `https://nvd.nist.gov/vuln/detail/${cveId.toLocaleLowerCase()}`;
  }

  return url;
}

export default function CveReportsTable() {
  const [data, setData] = useState<CveDataUnion | null>(null);
  const [loading, setLoading] = useState(true);
  const isBrowser = useIsBrowser();
  const [activeTabKey, setActiveTabKey] = useState("palette");
  const { colorMode } = useColorMode();
  const { defaultAlgorithm, darkAlgorithm } = theme;

  useEffect(() => {
    if (isBrowser) {
      const hash = window.location.hash?.replace("#", "") || "palette";
      setActiveTabKey(hash);
    }
  }, [isBrowser]);

  useEffect(() => {
    const minimizeData = (entry: Cve): MinimizedCve => ({
      metadata: {
        uid: entry.metadata.uid,
        cve: entry.metadata.cve,
        cvssScore: entry.metadata.cvssScore,
        cvePublishedTimestamp: entry.metadata.cvePublishedTimestamp,
        cveLastModifiedTimestamp: entry.metadata.cveLastModifiedTimestamp,
        advLastModifiedTimestamp: entry.metadata.advLastModifiedTimestamp,
      },
      spec: {
        assessment: {
          thirdParty: { isDependentOnThirdParty: entry.spec.assessment.thirdParty.isDependentOnThirdParty },
        },
        impact: { impactedVersions: entry.spec.impact.impactedVersions },
      },
      status: { status: entry.status.status },
    });

    const loadData = async () => {
      try {
        const response = (await import("../../../.docusaurus/security-bulletins/default/data.json")).default; // eslint-disable-line @typescript-eslint/no-unsafe-member-access
        const responseData = response as CveData;

        const reducedData: CveDataUnion = {
          palette: responseData.palette.map(minimizeData),
          paletteAirgap: responseData.paletteAirgap.map(minimizeData),
          vertex: responseData.vertex.map(minimizeData),
          vertexAirgap: responseData.vertexAirgap.map(minimizeData),
        };
        setData(reducedData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData().catch((error) => console.error("Error loading data:", error));
  }, []);

  useEffect(() => {
    if (isBrowser) {
      window.location.hash = activeTabKey;
    }
  }, [activeTabKey, isBrowser]);

  const columns: ColumnsType<MinimizedCve> = useMemo(
    () => [
      {
        title: "CVE ID",
        dataIndex: ["metadata", "cve"],
        key: "cve",
        sorter: (a, b) => a.metadata.cve.localeCompare(b.metadata.cve),
        render: (cve: string, record) => {
          return (
            <Link to={record.metadata.uid} style={{ color: "#1890ff" }}>
              {cve}
            </Link>
          );
        },
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
        dataIndex: ["metadata", "advLastModifiedTimestamp"],
        key: "advLastModifiedTimestamp",
        sorter: (a, b) =>
          new Date(a.metadata.advLastModifiedTimestamp).getTime() -
          new Date(b.metadata.advLastModifiedTimestamp).getTime(),
        render: (value: string) => (value ? new Date(value).toLocaleDateString() : "N/A"),
        defaultSortOrder: "descend",
      },
      {
        title: "Product Version",
        dataIndex: ["spec", "impact", "impactedVersions"],
        key: "productVersion",
        sorter: (a, b) => {
          const versionsA = a.spec.impact.impactedVersions.sort(semver.compare).reverse();
          const versionsB = b.spec.impact.impactedVersions.sort(semver.compare).reverse();
          return semver.compare(versionsB[0] || "0.0.0", versionsA[0] || "0.0.0");
        },
        render: (impactedVersions: string[]) => {
          const sortedVersions = impactedVersions.sort(semver.compare).reverse().slice(0, 3);
          return sortedVersions.join(", ") + (impactedVersions.length > 3 ? ", ..." : "");
        },
      },
      {
        title: "Third Party Vulnerability",
        dataIndex: ["spec", "assessment", "thirdParty", "isDependentOnThirdParty"],
        key: "vulnerabilityType",
        sorter: (a, b) =>
          a.spec.assessment.thirdParty.isDependentOnThirdParty === b.spec.assessment.thirdParty.isDependentOnThirdParty
            ? 0
            : 1,
        render: (record) => (record ? "Yes" : "No"),
      },
      {
        title: "CVSS Severity",
        dataIndex: ["metadata", "cvssScore"],
        key: "baseScore",
        sorter: (a, b) => a.metadata.cvssScore - b.metadata.cvssScore,
        render: (baseScore: number, record) => {
          const url = generateCVEOfficialDetailsUrl(record.metadata.cve.toLocaleLowerCase());
          return <Link to={url}>{baseScore}</Link>;
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
        scroll={{ y: 800 }}
        bordered={true}
        tableLayout="fixed"
        sticky={true}
      />
    </div>
  );

  const tabs = useMemo(
    () => [
      { label: "Palette Enterprise", key: "palette", children: renderCveTable(data?.palette || []) },
      { label: "Palette Enterprise Airgap", key: "paletteAirgap", children: renderCveTable(data?.paletteAirgap || []) },
      { label: "VerteX", key: "vertex", children: renderCveTable(data?.vertex || []) },
      { label: "VerteX Airgap", key: "vertexAirgap", children: renderCveTable(data?.vertexAirgap || []) },
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
          <Tabs
            defaultActiveKey={activeTabKey}
            activeKey={activeTabKey}
            onChange={(key) => setActiveTabKey(key)}
            items={tabs}
            destroyInactiveTabPane={false}
            type="card"
          />
        </div>
      </ConfigProvider>
    </div>
  );
}
