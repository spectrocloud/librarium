import React from "react";
import styles from "./PackFilters.module.scss";
import CustomLabel from "./CategorySelector/CustomLabel";
import FilterSelect from "./CategorySelector/FilterSelect";
import "./packsFilters.antd.css";
import { packTypeNames, cloudProviderTypes } from "../../constants/packs";

interface PackFiltersProps {
  categories: string[];
  registries: registry[];
  setSelectedSearchFilters: (filters: SelectedFilters) => void;
  selectedFilters: SelectedFilters;
}

interface registry {
  uid: string;
  name: string;
}

interface sources {
  label: string;
  value: string;
}

interface SelectedFilters {
  category: string[];
  registries: string[];
  cloudTypes: string[];
  source: string[];
}

const sourceList: sources[] = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Verified",
    value: "verified",
  },
  {
    label: "Community",
    value: "community",
  },
];

export default function PacksFilters({
  categories,
  registries,
  setSelectedSearchFilters,
  selectedFilters,
}: PackFiltersProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.filterItems}>
        <CustomLabel label="Type" />
        <FilterSelect
          selectMode="multiple"
          options={categories.map((category: string) => {
            return { value: category, label: packTypeNames[category] };
          })}
          onChange={(items) => setSelectedSearchFilters({ ...selectedFilters, category: items as string[] })}
          value={selectedFilters.category}
        />
      </div>
      <div className={styles.filterItems}>
        <CustomLabel label="Registry" />
        <FilterSelect
          selectMode="multiple"
          options={registries.map((registry) => {
            return { value: registry.uid, label: registry.name };
          })}
          onChange={(items) => setSelectedSearchFilters({ ...selectedFilters, registries: items as string[] })}
          value={selectedFilters.registries}
        />
      </div>
      <div className={styles.filterItems}>
        <CustomLabel label="Cloud Provider" />
        <FilterSelect
          options={cloudProviderTypes.map((provider) => {
            return { value: provider.name, label: provider.displayName };
          })}
          onChange={(item) => {
            setSelectedSearchFilters({
              ...selectedFilters,
              cloudTypes: item ? [item as string] : [],
            });
          }}
          value={selectedFilters.cloudTypes.length ? selectedFilters.cloudTypes[0] : undefined}
        />
      </div>
      <div className={styles.filterItems}>
        <CustomLabel label="Source" />
        <FilterSelect
          options={sourceList}
          onChange={(item) => {
            setSelectedSearchFilters({
              ...selectedFilters,
              source: item ? [item as string] : [],
            });
          }}
          value={selectedFilters.source.length ? selectedFilters.source[0] : undefined}
        />
      </div>
    </div>
  );
}
