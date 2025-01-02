import React, { useEffect, useState, useMemo } from "react";
import { Table, ConfigProvider, theme } from "antd";
import styles from "./PacksTable.module.scss";
import Search from "../Technologies/Search";
import { useColorMode } from "@docusaurus/theme-common";
import type { ColumnsType } from "antd/es/table";
import Admonition from "@theme/Admonition";

type Pack = {
  name: string;
  displayName: string;
  layer: string;
  addonType: string;
  cloudTypesFormatted: string;
  version: string;
  status: string;
  prodStatus: string;
  inProduction: string;
  packCreateDate: string;
  packLastModifiedDate: string;
  timeLastUpdated: string;
  releaseType: string;
  contributor: string;
  docsURL: string;
  hash?: string;
};

const statusClassNames: Record<string, string> = {
  deprecated: styles.deprecated,
  deleted: styles.deleted,
  disabled: styles.disabled,
};

// Format the cloud type strings so they display properly
const formatCloudType = (type: string): string => {
  const cloudTypeMapping: Record<string, string> = {
    aws: "AWS",
    eks: "EKS",
    vsphere: "vSphere",
    maas: "MaaS",
    gcp: "GCP",
    edge: "Edge",
    openstack: "OpenStack",
    "edge-native": "Edge",
    tke: "TKE",
    aks: "AKS",
    gke: "GKE",
    all: "All",
    azure: "Azure",
    tencent: "Tencent",
    // ... add other special cases as needed
  };

  return type
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part !== "nested" && part !== "libvirt" && part !== "baremetal" && part !== "coxedge")
    .map((part) => cloudTypeMapping[part] || capitalizeWord(part))
    .join(", ");
};

// Capitalize the word as a default option
const capitalizeWord = (string: string): string => {
  return string.toUpperCase();
};

const columns: ColumnsType<Pack> = [
  {
    title: "Name",
    dataIndex: "displayName",
    key: "displayName",
    sorter: (a, b) => a.displayName.localeCompare(b.displayName),
  },
  {
    title: "Cloud Types",
    dataIndex: "cloudTypesFormatted",
    key: "cloudTypesFormatted",
    sorter: (a, b) => a.cloudTypesFormatted.localeCompare(b.cloudTypesFormatted),
    render: (value: string) => formatCloudType(value),
  },
  {
    title: "Version",
    dataIndex: "version",
    key: "version",
    sorter: (a, b) => a.version.localeCompare(b.version),
  },
  {
    title: "Status",
    dataIndex: "prodStatus",
    key: "prodStatus",
    sorter: (a, b) => a.prodStatus.localeCompare(b.prodStatus),
    render: (status: string) => {
      const className = statusClassNames[status];
      return <span className={className}>{status}</span>;
    },
  },
  {
    title: "Last Updated",
    dataIndex: "packLastModifiedDate",
    key: "packLastModifiedDate",
    sorter: (a, b) => new Date(a.packLastModifiedDate).getTime() - new Date(b.packLastModifiedDate).getTime(),
    render: (date: string) => (date === "-" ? date : new Date(date).toLocaleDateString()),
  },
  {
    title: "Last Modified",
    dataIndex: "timeLastUpdated",
    key: "timeLastUpdated",
    sorter: (a, b) => new Date(a.packLastModifiedDate).getTime() - new Date(b.packLastModifiedDate).getTime(),
    render: (date: string, pack: Pack) => {
      if (date === "-") return date;
      const dateObject = new Date(pack.packLastModifiedDate);
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      const isWithinAMonth = dateObject >= oneMonthAgo;
      return <span className={isWithinAMonth ? styles.green : styles.red}>{date}</span>;
    },
  },
];

// Filter the packs to only include those with status "deprecated"
interface PacksData {
  dateCreated: string;
  Packs: Pack[];
}

const FilteredTable: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [deprecatedPacks, setDeprecatedPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { colorMode } = useColorMode();
  const { defaultAlgorithm, darkAlgorithm } = theme;

  useEffect(() => {
    fetch("/packs-data/packs_report.json")
      .then((response) => response.json())
      .then((packData: PacksData) => {
        const deprecatedPackData = packData.Packs.filter((pack) => {
          if (pack.displayName === "") {
            pack.displayName = toTitleCase(pack.name);
            pack.timeLastUpdated = "-";
            pack.packLastModifiedDate = "-";
          }
          pack.hash = Math.random().toString(36).substring(2, 15);
          return pack.prodStatus !== "active" && pack.prodStatus !== "unknown";
        });
        setDeprecatedPacks(deprecatedPackData);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }, []);

  // Simplified search filtering
  const filteredPacks = useMemo(() => {
    const searchTerm = searchValue.trim().toLowerCase();
    if (!searchTerm) return deprecatedPacks;

    return deprecatedPacks.filter((pack) => pack.displayName.toLowerCase().includes(searchTerm));
  }, [deprecatedPacks, searchValue]);

  // Single handler for both onChange and onSearch
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  return (
    <div className={styles.tabPane}>
      <ConfigProvider theme={{ algorithm: colorMode === "dark" ? darkAlgorithm : defaultAlgorithm }}>
        <div className={styles.unsupportedMessage}>
          <Admonition type="warning" title="Unsupported Display Size">
            The current screen size is not supported. Use a larger display to access the Packs table.
          </Admonition>
        </div>

        <div className={styles.tableContainer}>
          <div className={styles.searchContainer}>
            <Search value={searchValue} onSearch={handleSearchChange} placeholder="Search Deprecated Packs" />
          </div>
          <Table
            columns={columns}
            dataSource={filteredPacks}
            loading={loading}
            rowKey={(record) => `${record.name}-${record.version}-${record.hash}`}
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
          {error && <div className={styles.error}>Failed to load Deprecated Packs</div>}
        </div>
      </ConfigProvider>
    </div>
  );
};

// Convert the pack name to title case
export function toTitleCase(str: string) {
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
}

export default FilteredTable;
