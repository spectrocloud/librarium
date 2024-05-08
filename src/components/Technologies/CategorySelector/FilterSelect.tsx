import React from "react";
import { Select, SelectProps } from "antd";
import filterStyles from "./CategorySelector.module.scss";

interface FilterSelectProps {
  selectMode?: SelectProps["mode"];
  options: { value: string, label: string }[];
  onChange: (...args: any) => void;
  value: SelectProps["value"];
};

export default function FilterSelect({ selectMode, options, onChange, value }: FilterSelectProps) {
  return (
    <div className={filterStyles.wrapper}>
      <Select
        className={filterStyles.selectBox}
        mode={selectMode as "tags" | "multiple" | undefined}
        allowClear={true}
        placeholder="Search"
        onChange={onChange}
        value={value}
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
