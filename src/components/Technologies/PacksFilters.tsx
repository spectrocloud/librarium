import React from "react";
import styles from "./PackFilters.module.scss";
import CustomLabel from "./CategorySelector/CustomLabel";
import FilterSelect from "./CategorySelector/FilterSelect";
import "./packsFilters.antd.css";
import { packTypeNames, cloudProviderTypes } from "../../constants/packs";
interface PackFiltersProps {
  categories: string[];
  registries: any[];
  setSelectedSearchFilters: (...args: any[]) => void;
  selectedFilters: any;
}

const sourceList: any[] = [
  {
    label: "Verified",
    value: "verified"
  },
  {
    label: "Community",
    value: "community",
  },
];

export default function PacksFilters({ categories, registries, setSelectedSearchFilters, selectedFilters }: PackFiltersProps) {


  return (
    <div className={styles.wrapper}>
      <div className={styles.filterItems}>
        <CustomLabel label="Type" />
        <FilterSelect
          selectMode="multiple"
          options={categories.map((category) => {
            return { value: category, label: packTypeNames[category as keyof typeof packTypeNames] };
          })}
          onChange={(items) => setSelectedSearchFilters({ category: items })}
          value={selectedFilters.category}
        />
      </div>
      <div className={styles.filterItems}>
        <CustomLabel label="Registry" />
        <FilterSelect
          selectMode="multiple"
          options={Array.from(registries).map((registry) => {
            return { value: registry.uid, label: registry.name };
          })}
          onChange={(items) => setSelectedSearchFilters({ registries: items })}
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
            if (item) {
              setSelectedSearchFilters({ cloudTypes: [item] })
            } else {
              setSelectedSearchFilters({ cloudTypes: [] })
            }
          }}
          value={selectedFilters.cloudTypes.length ? selectedFilters.cloudTypes[0] : ""}
        />
      </div>
      <div className={styles.filterItems}>
        <CustomLabel label="Source" />
        <FilterSelect
          options={sourceList}
          onChange={(item) => {
            if (item) {
              setSelectedSearchFilters({ source: [item] })
            } else {
              setSelectedSearchFilters({ source: [] })
            }
          }}
          value={selectedFilters.source.length ? selectedFilters.source[0] : ""}
        />
      </div>
    </div >
  );
}
