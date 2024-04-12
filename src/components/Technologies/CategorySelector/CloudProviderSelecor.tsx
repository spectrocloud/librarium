import React from "react";
import { Select } from "antd";
import { cloudProviderTypes } from "../PackConstants";
import styles from "./CategorySelector.module.scss";

interface CloudProviderSelectorProps {
  selected: string;
  selectCloudProvider: (provider: string) => void;
}

export default function CloudProviderSelecor({ selected="", selectCloudProvider  }: CloudProviderSelectorProps) {
  const getOptions = () => {
    const providers = Object.keys(cloudProviderTypes);
    const providersMap = providers.map((provider) => {
      return (
        <Select.Option key={provider}>
          {cloudProviderTypes[provider as keyof typeof cloudProviderTypes] || provider}
        </Select.Option>
      );
    });
    return providersMap;
  }
  return(
    <div className={styles.wrapper}>
      <Select
        allowClear
        onChange={(item) => selectCloudProvider(item as string)} // Cast item to string[]
        placeholder="Search"
      >
        {getOptions()}
      </Select>
    </div>
  )
};
