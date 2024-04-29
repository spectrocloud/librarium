import React from "react";
import { Select } from "antd";
import filterStyles from "./CategorySelector.module.scss";
interface FilterSelectProps {
  selectMode?: string;
  options: any[];
  setSelectedSearchFilters: (...args: any) => void;
};
interface SelectOption {
  key: string,
  name: string
}
export default function FilterSelect({ selectMode, options, setSelectedSearchFilters }: FilterSelectProps) {
  return (
    <div className={filterStyles.wrapper}>
      <Select
        className={filterStyles.selectBox}
        mode={selectMode as "tags" | "multiple" | undefined}
        allowClear={true}
        placeholder="Search"
        onChange={(item: any) => setSelectedSearchFilters(item)}
      >
        {options.map((item: SelectOption) => {
          return (
            <Select.Option key={item.key}>
              {item.name}
            </Select.Option>
          )
        })}
      </Select>
    </div>
  );
}
