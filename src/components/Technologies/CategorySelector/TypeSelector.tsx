import React from "react";
import styles from "./CategorySelector.module.scss";
import { Select } from "antd";
import { packTypeNames } from "../PackConstants";

interface TypeSelectorProps {
  categories: string[];
  selected: string[]; // Update the type to string[]
  selectCategory: (category: string[]) => void;
}

export default function TypeSelector({ categories, selected = [""], selectCategory }: TypeSelectorProps) {
  function getOptions(categories: string[]) {
    const categoriesMap = categories.map((category) => {
      return (
        <Select.Option key={category}>
          {packTypeNames[category as keyof typeof packTypeNames]}
        </Select.Option>
      );
    });
    return categoriesMap;
  }

  return (
    <div className={styles.wrapper}>
      <Select
        mode="multiple"
        allowClear
        placeholder="Search"
        onChange={(item) => selectCategory(item as string[])} // Cast item to string[]
      >
        {getOptions(categories)}
      </Select>
    </div>
  );
}
