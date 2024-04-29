import React from "react";
import styles from "./PackFilters.module.scss";
import filterStyles from "./CategorySelector/CategorySelector.module.scss";
import CustomLabel from "./CategorySelector/CustomLabel";
import AdditionalFilters from "./CategorySelector/AdditionalFilters";
import FilterSelect from "./CategorySelector/FilterSelect";
import { packTypeNames, cloudProviderTypes } from "../../constants/packs";
import { Select } from "antd";
interface PackFiltersProps {
  categories: string[];
  registries: any[];
  setSelectedSearchFilters: (...args: any[]) => void;
}

export default function PacksFilters({ categories, registries, setSelectedSearchFilters }: PackFiltersProps) {
  const additionalFiltersProps: string[] = [
    "verified", "community"
  ];
  function selectAdditionalFilters(additionalFilters: string[]) {
    const mappedAdditionalFilters: { [key: string]: boolean[] } = additionalFiltersProps.reduce((accumulator, filter) => {
      accumulator[filter] = additionalFilters.includes(filter) ? [true] : [];
      return accumulator;
    }, {} as { [key: string]: boolean[] }); // Add index signature
    setSelectedSearchFilters(mappedAdditionalFilters);
  }
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
        />
      </div>
      <div className={styles.filterItems}>
        <CustomLabel label="Cloud Provider" />
        <FilterSelect
          options={cloudProviderTypes.map((provider) => {
            return { value: provider.name, label: provider.displayName };
          })}
          onChange={(item) => {
            if(item) {
              setSelectedSearchFilters({ cloudTypes: [item] })
            } else {
              setSelectedSearchFilters({ cloudTypes: [] })
            }
          }}
        />
      </div>
      <div className={styles.filterItems}>
        <AdditionalFilters selectAdditionalFilters={selectAdditionalFilters} />
      </div>
    </div >
  );
}
