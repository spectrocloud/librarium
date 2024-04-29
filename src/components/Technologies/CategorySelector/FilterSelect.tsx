import React from "react";
import { Select } from "antd";
import filterStyles from "./CategorySelector.module.scss";
interface FilterSelectProps {
  selectMode?: string;
  options: { value: string, label: string }[];
  onChange: (...args: any) => void;
};

export default function FilterSelect({ selectMode, options, onChange }: FilterSelectProps) {
  return (
    <div className={filterStyles.wrapper}>
      <Select
        className={filterStyles.selectBox}
        mode={selectMode as "tags" | "multiple" | undefined}
        allowClear={true}
        placeholder="Search"
        onChange={(item: any) => onChange(item)}
      >
        {options.map((item) => {
          return (
            <Select.Option value={item.value}>
              {item.label}
            </Select.Option>
          )
        })}
      </Select>
    </div>
  );
}
