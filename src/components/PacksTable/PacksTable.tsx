import React, { useEffect, useState, useCallback } from "react";
import CustomTable from "../CustomTable/CustomTable";
import styles from "./PacksTable.module.scss";
import Search from "../Technologies/Search";

type Pack = {
  name: string;
  displayName: string;
  layer: string;
  addonType: string;
  cloudTypesFormatted: string;
  version: string;
  status: string;
  packCreateDate: string;
  packLastModifiedDate: string;
  timeLastUpdated: string;
  releaseType: string;
  contributor: string;
  docsURL: string;
};

const statusClassNames: Record<string, string> = {
  deprecated: styles.deprecated,
  deleted: styles.deleted,
  disabled: styles.disabled,
};

interface PacksColumn {
  title: string;
  dataIndex: keyof Pack;
  key: string;
  sorter?: (a: Pack, b: Pack) => number;
  render?: (value: string, row: Pack) => React.ReactNode;
  width: number;
}

const columns: PacksColumn[] = [
  {
    title: "Name",
    dataIndex: "displayName",
    key: "displayName",
    sorter: (a: Pack, b: Pack) => a.displayName.localeCompare(b.displayName),
    width: 200,
  },
  {
    title: "Version",
    dataIndex: "version",
    key: "version",
    sorter: (a: Pack, b: Pack) => a.version.localeCompare(b.version),
    width: 120,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    sorter: (a: Pack, b: Pack) => a.status.localeCompare(b.status),
    render: (status: string) => {
      const className = statusClassNames[status];
      return <span className={className}>{status}</span>;
    },
    width: 150,
  },
  {
    title: "Last Updated",
    dataIndex: "packLastModifiedDate",
    key: "packLastModifiedDate",
    sorter: (a: Pack, b: Pack) =>
      new Date(a.packLastModifiedDate).getTime() - new Date(b.packLastModifiedDate).getTime(),
    width: 150,
  },
  {
    title: "Last Modified",
    dataIndex: "timeLastUpdated",
    key: "timeLastUpdated",
    sorter: (a: Pack, b: Pack) =>
      new Date(a.packLastModifiedDate).getTime() - new Date(b.packLastModifiedDate).getTime(),
    render: (date: string, pack: Pack) => {
      const dateObject = new Date(pack.packLastModifiedDate);
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      const isWithinAMonth = dateObject >= oneMonthAgo;
      return <span className={isWithinAMonth ? styles.green : styles.red}>{date}</span>;
    },
    width: 150,
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

  useEffect(() => {
    fetch("/packs-data/packs_report.json")
      .then((response) => response.json())
      .then((packData: PacksData) => {
        const deprecatedPackData = packData.Packs.filter((pack) => pack.status !== "active");
        setDeprecatedPacks(deprecatedPackData);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }, []);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Delay the update to the search value by 300ms to debounce the search
    const timer = setTimeout(() => {
      setSearchValue(value);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const filteredPacks = searchValue
    ? deprecatedPacks.filter((pack) => pack.name.toLowerCase().includes(searchValue.toLowerCase()))
    : deprecatedPacks;

  return (
    <div className={styles.tableWrapper}>
      <Search onSearch={handleSearch} placeholder={"Search Deprecated Packs"}></Search>
      <CustomTable<Pack>
        className={styles.packsTable}
        columns={columns}
        dataSource={filteredPacks}
        loading={loading}
        scrollY={250}
        pagination={{ pageSize: 250 }}
      />
      {error && <div className={styles.error}>Failed to load Deprecated Packs</div>}
    </div>
  );
};

export default FilteredTable;
