import React from "react";
import styles from "./PackFilters.module.scss";
import filterStyles from "./CategorySelector/CategorySelector.module.scss";
import CustomLabel from "./CategorySelector/CustomLabel";
import AdditionalFilters from "./CategorySelector/AdditionalFilters";
import { packTypeNames, cloudProviderTypes } from "./PackConstants";
import { Select } from "antd";
interface PackFiltersProps {
  categories: string[];
  registries: any[];
  setSelectedSearchFilters: (...args: any[]) => void;
}
export default function PacksFilters({ categories, registries, setSelectedSearchFilters }: PackFiltersProps) {
  function selectAdditionalFilters(additionalFilters: string[]) {
    setSelectedSearchFilters({ additionalFilters: additionalFilters });
  }
  return (
    <div className={styles.wrapper}>
      <div className={styles.filterItems}>
        <CustomLabel label="Type" />
        <div className={filterStyles.wrapper}>
          <Select
            className={filterStyles.selectbox}
            mode="multiple"
            allowClear
            placeholder="Search"
            onChange={(item) => setSelectedSearchFilters({ category: item as string[] })}
          >
            {categories.map((category) => {
              return (
                <Select.Option key={category}>
                  {packTypeNames[category as keyof typeof packTypeNames]}
                </Select.Option>
              );
            })}
          </Select>
        </div>
      </div>
      <div className={styles.filterItems}>
        <CustomLabel label="Registry" />
        <div className={filterStyles.wrapper}>
          <Select
            className={filterStyles.selectbox}
            mode="multiple"
            allowClear={true}
            placeholder="Search"
            onChange={(item: string[]) => setSelectedSearchFilters({ registries: item })}
          >
            {Array.from(registries).map((registry) => {
              return (
                <Select.Option key={registry.uid}>
                  {registry.name}
                </Select.Option>
              )
            })}
          </Select>
        </div>
      </div>
      <div className={styles.filterItems}>
        <CustomLabel label="Cloud Provider" />
        <div className={filterStyles.wrapper}>
          <Select
            className={filterStyles.selectbox}
            allowClear
            onChange={(item) => setSelectedSearchFilters({ cloudTypes: item })}
            placeholder="Search"
          >
            {
              cloudProviderTypes.map((provider) => {
                return (
                  <Select.Option key={provider.name}>
                    {provider.displayName}
                  </Select.Option>
                )
              })
            }
          </Select>
        </div>
      </div>
      <div className={styles.filterItems}>
        <AdditionalFilters selectAdditionalFilters={selectAdditionalFilters} />
      </div>
    </div >
  );
}
