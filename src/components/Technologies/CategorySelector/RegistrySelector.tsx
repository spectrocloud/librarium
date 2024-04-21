import React from "react";
import styles from "./CategorySelector.module.scss";
import { Select, ConfigProvider, ThemeConfig, theme } from "antd";

interface RegistrySelectorProps {
  registries: any[];
  selected: string[];
  selectRegistries: (registry: string[]) => void;
}

export default function RegistrySelector({ registries, selected = [""], selectRegistries }: RegistrySelectorProps) {
  function getOptions() {
    return Array.from(registries).map((registry) => {
      return (
        <Select.Option key={registry.uid}>
          {registry.name}
        </Select.Option>
      );
    });
  }

  return (
    <div className={styles.wrapper}>
      <Select
        mode="multiple"
        allowClear={true}
        placeholder="Search"
        onChange={(item: string[]) => selectRegistries(item)}
      >
        {getOptions()}
      </Select>
    </div>
  );
}
