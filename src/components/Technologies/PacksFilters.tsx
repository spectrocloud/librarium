import React from "react";
import TypeSelector from "./CategorySelector/TypeSelector";
import CloudProviderSelecor from "./CategorySelector/CloudProviderSelecor";
import styles from "./PackFilters.module.scss";
import CustomLabel from "./CategorySelector/CustomLabel";
import AdditionalFilters from "./CategorySelector/AdditionalFilters";
import RegistrySelector from "./CategorySelector/RegistrySelector";
import { Select } from "antd";
interface PackFiltersProps {
  categories: string[];
  registries: any[];
  selectedFilters: { category: string[], provider: string, additionalFilters: string[] };
  setSelectedSearchFilters: (...args: any[]) => void;
}
export default function PacksFilters({ categories, registries, selectedFilters, setSelectedSearchFilters }: PackFiltersProps) {
  function setSelectedCategory(category: string[]) {
    setSelectedSearchFilters({ category: category });
  }
  function setSelectedProvider(provider: string) {
    setSelectedSearchFilters({ provider: provider });
  }
  function selectAdditionalFilters(additionalFilters: string[]) {
    setSelectedSearchFilters({ additionalFilters: additionalFilters });
  }
  function setSelectedRegistries(registries: string[]) {
    setSelectedSearchFilters({ registries: registries });
  }
  return (
    <div className={styles.wrapper}>
      <div className={styles.filterItems}>
        <CustomLabel label="Type" />
        <TypeSelector categories={[...categories]} selectCategory={setSelectedCategory} selected={selectedFilters.category} />
      </div>
      <div className={styles.filterItems}>
        <CustomLabel label="Registry" />
        <RegistrySelector registries={registries} selectRegistries={setSelectedRegistries} selected={selectedFilters.category} />
      </div>
      <div className={styles.filterItems}>
        <CustomLabel label="Cloud Provider" />
        <CloudProviderSelecor selected={selectedFilters.provider} selectCloudProvider={setSelectedProvider} />
      </div>
      <div className={styles.filterItems}>
        <AdditionalFilters selectAdditionalFilters={selectAdditionalFilters} />
      </div>
    </div>
  );
}
