import React, { useEffect, useState, useMemo } from "react";
import { Table, ConfigProvider, theme } from "antd";
import styles from "./OsCveTable.module.scss";
import Search from "../Technologies/Search";
import { useColorMode } from "@docusaurus/theme-common";
import type { ColumnsType } from "antd/es/table";
import Admonition from "@theme/Admonition";
import { Link } from "react-router-dom";

type OsCve = {
  uid: string;
  displayName: string;
  osDistribution: string;
  osVersion: string;
  k8sDistribution: string;
  k8sVersion: string;
  timeLastUpdated: string;
  hash?: string;
};

interface ProviderCveItem {
  kind: string;
  metadata: {
    uid: string;
    summary: string;
    advCreatedTimestamp: string;
    advLastModifiedTimestamp: string;
  };
  spec: {
    assessment: {
      impact: string;
      severity: string;
      thirdParty: {
        isDependentOnThirdParty: boolean;
      };
    };
    impact: {
      isImpacting: boolean;
      impactedVersions: string[];
    };
  };
}

interface AllCVEList {
  provider: ProviderCveItem[];
}

const columns: ColumnsType<OsCve> = [
  {
    title: "Name",
    dataIndex: "displayName",
    key: "displayName",
    sorter: (a, b) => a.displayName.localeCompare(b.displayName),
    render: (text: string, record: OsCve) => <Link to={`./${record.uid}`}>{text}</Link>,
  },
  {
    title: "FIPS Compliant",
    dataIndex: "uid",
    key: "fipsCompliant",
    sorter: (a, b) => Number(isFipsCompliant(b.uid)) - Number(isFipsCompliant(a.uid)),
    render: (uid: string) => (isFipsCompliant(uid) ? "Yes" : "No"),
  },
  {
    title: "OS Distribution",
    dataIndex: "osDistribution",
    key: "osDistribution",
    sorter: (a, b) => a.osDistribution.localeCompare(b.osDistribution),
  },
  {
    title: "OS Version",
    dataIndex: "osVersion",
    key: "osVersion",
    sorter: (a, b) => a.osVersion.localeCompare(b.osVersion),
  },
  {
    title: "Kubernetes Distribution",
    dataIndex: "k8sDistribution",
    key: "k8sDistribution",
    sorter: (a, b) => a.k8sDistribution.localeCompare(b.k8sDistribution),
  },
  {
    title: "Kubernetes Version",
    dataIndex: "k8sVersion",
    key: "k8sVersion",
    sorter: (a, b) => a.k8sVersion.localeCompare(b.k8sVersion),
  },
  {
    title: "Last Modified",
    dataIndex: "timeLastUpdated",
    key: "timeLastUpdated",
    sorter: (a, b) => new Date(a.timeLastUpdated).getTime() - new Date(b.timeLastUpdated).getTime(),
  },
];

const distroMap: [string, string][] = [
  ["pxke-fips", "PXK-FIPS"],
  ["pxke", "PXK"],
  ["rke2", "RKE2"],
  ["k3s", "K3s"],
  ["nodeadm", "Nodeadm"],
  ["kubernetes", "PXK"], // fallback if "kubernetes" is found
];

function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    console.warn(`Invalid date string: ${isoString}`);
    return "N/A";
  }

  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const year = date.getUTCFullYear();

  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  return `${month}/${day}/${year} ${hours}:${minutes} UTC`;
}

const OsCveTable: React.FC<{ dataOverride?: AllCVEList }> = ({ dataOverride }) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [osCves, setOsCves] = useState<OsCve[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { colorMode } = useColorMode();
  const { defaultAlgorithm, darkAlgorithm } = theme;
  const isDark = colorMode === "dark";
  const customTheme = {
    algorithm: isDark ? darkAlgorithm : defaultAlgorithm, // Start with the default dark theme
    token: {
      colorBgContainer: isDark ? "#012121" : "#F3F0EE",
      colorPrimary: isDark ? "#44B2AF" : "#1F7A78",
    },
  };

  useEffect(() => {
    const fetchOsCveData = async () => {
      try {
        // Use dynamic import instead of fetch
        let data: AllCVEList;

        if (dataOverride) {
          data = dataOverride;
        } else if (process.env.NODE_ENV !== "test") {
          const res = await fetch("/security-data/data.json");
          data = await res.json();
        } else {
          setError(true);
          setLoading(false);
          console.error("No data available for OS CVE table.");
          return;
        }

        // Extract the OS CVE data from the provider array
        const osCveData = data.provider.map((item: ProviderCveItem) => {
          const { metadata } = item;

          return {
            uid: metadata.uid,
            displayName: metadata.summary,
            osDistribution: getOsDistro(metadata.summary),
            osVersion: getOsVersion(metadata.uid),
            k8sDistribution: getKubernetesDistro(metadata.summary),
            k8sVersion: getKubernetesVersion(metadata.uid),
            timeLastUpdated: formatTimestamp(metadata.advLastModifiedTimestamp || metadata.advCreatedTimestamp),
            hash: Math.random().toString(36).substring(2, 15),
          };
        });

        setOsCves(osCveData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(true);
        console.error("Error fetching OS CVE data:", error);
      }
    };

    void fetchOsCveData();
  }, []);

  // Simplified search filtering
  const filteredOsCves = useMemo(() => {
    const searchTerm = searchValue.trim().toLowerCase();
    if (!searchTerm) return osCves;

    return osCves.filter((cve) => cve.displayName.toLowerCase().includes(searchTerm));
  }, [osCves, searchValue]);

  // Single handler for both onChange and onSearch
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  return (
    <div className={styles.tabPane}>
      <ConfigProvider theme={customTheme}>
        <div className={styles.unsupportedMessage}>
          <Admonition type="warning" title="Unsupported Display Size">
            The current screen size is not supported. Use a larger display to access the OS Security Notice table.
          </Admonition>
        </div>

        <div className={styles.tableContainer}>
          <div className={styles.searchContainer}>
            <Search value={searchValue} onSearch={handleSearchChange} placeholder="Search OS CVEs" />
          </div>
          <Table
            columns={columns}
            dataSource={filteredOsCves}
            loading={loading}
            rowKey={(record) => `${record.displayName}-${record.hash}`}
            pagination={{
              pageSizeOptions: ["500", "1000", "2500", "5000"],
              defaultPageSize: 1000,
              showSizeChanger: true,
            }}
            scroll={{ y: 800 }}
            bordered
            tableLayout="fixed"
            sticky
          />
          {error && <div className={styles.error}>Failed to load OS security advisories.</div>}
        </div>
      </ConfigProvider>
    </div>
  );
};

// Helper functions

// Capitalize the word as a default option
const capitalizeWord = (string: string): string => {
  return string.toUpperCase();
};

const toTitleCase = (str: string): string => {
  return (
    str
      .replace(/([a-z])([A-Z])|-/g, "$1 $2")
      // Split, filter, and capitalize words
      .split(/\s+/)
      .map((word) => {
        // Words that should be capitalized
        if (["CNI", "CSI", "OSS", "EBS", "AWS"].includes(word.toUpperCase())) {
          return word.toUpperCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .filter((word) => word)
      .join(" ")
  );
};

const getOsDistro = (summary: string): string => {
  const lowerSummary = summary.toLowerCase();
  const isFIPS = lowerSummary.includes("fips");
  let distro = "Unspecified";

  if (lowerSummary.includes("ubuntu")) {
    distro = "Ubuntu";
  } else if (lowerSummary.includes("opensuse-leap") || lowerSummary.includes("suse")) {
    distro = "openSUSE Leap";
  } else if (lowerSummary.includes("rhel") || lowerSummary.includes("red hat")) {
    distro = "RHEL";
  }

  return isFIPS ? `${distro}-FIPS` : distro;
};

const getOsVersion = (uid: string): string => {
  // Match the first four-digit sequence in the UID
  const versionMatch = uid.match(/-(\d{4})-/);
  if (!versionMatch) {
    return "Unspecified";
  }

  const rawVersion = versionMatch[1]; // Extracted version (e.g., "2204" → "22.04")

  // Format as "XX.YY"
  return `${rawVersion.slice(0, 2)}.${rawVersion.slice(2, 4)}`;
};

const getKubernetesDistro = (summary: string): string => {
  const lowerSummary = summary.toLowerCase();

  for (const [keyword, label] of distroMap) {
    if (lowerSummary.includes(keyword)) {
      return label;
    }
  }

  return "Unspecified";
};

const getKubernetesVersion = (uid: string): string => {
  // Match the Kubernetes version after "-k-" (3, 4, or 5 digits)
  const versionMatch = uid.match(/-k-(\d{3,5})-/);
  if (!versionMatch) {
    return "Unspecified";
  }

  const rawVersion = versionMatch[1]; // Extracted version string
  const length = rawVersion.length;

  if (length === 3) {
    // Format 3-digit version: X.Y.Z (e.g., "231" → "2.3.1")
    return `${rawVersion[0]}.${rawVersion[1]}.${rawVersion[2]}`;
  } else if (length === 4) {
    // Format 4-digit version: X.Y.Z (e.g., "1322" → "1.32.2")
    return `${rawVersion[0]}.${rawVersion.slice(1, 3)}.${rawVersion[3]}`;
  } else if (length === 5) {
    // Format 5-digit version: 1.XX.YY (e.g., "13111" → "1.31.11")
    return `1.${rawVersion.slice(1, 3)}.${rawVersion.slice(3, 5)}`;
  }

  return "Unspecified"; // Should never reach here
};

const isFipsCompliant = (uid: string): boolean => {
  // Case-insensitive check for 'fips' in the UID
  return uid.toLowerCase().includes("fips");
};
// Export statements

export { capitalizeWord, toTitleCase };

export default OsCveTable;
