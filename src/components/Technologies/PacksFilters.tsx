import React from "react";
import TypeSelector from "./CategorySelector/TypeSelector";
import CloudProviderSelecor from "./CategorySelector/CloudProviderSelecor";
import styles from "./PackFilters.module.scss";
import CustomLabel from "./CategorySelector/CustomLabel";
import AdditionalFilters from "./CategorySelector/AdditionalFilters";
interface PackFiltersProps {
  categories: string[];
  selectedFilters: { category: string[], provider: string, additionalFilters: string[]};
  setSelectedSearchFilters: (...args: any[]) => void;
}
export default function PacksFilters({ categories, selectedFilters, setSelectedSearchFilters }: PackFiltersProps) {
  function setSelectedCategory(category: string[]) {
    setSelectedSearchFilters({category: category});
    console.log("category", category);
  }
  function setSelectedProvider(provider: string) {
    setSelectedSearchFilters({provider: provider});
    console.log("provider", provider);
  }
  function selectAdditionalFilters(additionalFilters: string[]) {
    setSelectedSearchFilters({additionalFilters: additionalFilters});
    console.log("additionalFilters", additionalFilters);
  }
  return (
    <div className={styles.wrapper}>
      <div className={styles.filterItems}>
        <CustomLabel label="Type" />
        <TypeSelector categories={[...categories]} selectCategory={setSelectedCategory} selected={selectedFilters.category} />
      </div>
      <div className={styles.filterItems}>
        <CustomLabel label="Cloud Provider" />
        <CloudProviderSelecor selected={selectedFilters.provider} selectCloudProvider={setSelectedProvider} />
      </div>
      <div className={styles.filterItems}>
        <AdditionalFilters selectAdditionalFilters={selectAdditionalFilters}/>
      </div>
    </div>
  );
}
