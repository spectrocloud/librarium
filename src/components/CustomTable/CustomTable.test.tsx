import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import CustomTable from "./CustomTable";
import styles from "./CustomTable.module.scss";

const sampleColumns: columnData[] = [
  { title: "Name", dataIndex: "name" },
  { title: "Age", dataIndex: "age" },
];

const dataSource = [
  { name: "John", age: 30 },
  { name: "Jane", age: 25 },
  { name: "Doe", age: 35 },
];

interface columnData {
  title: string;
  dataIndex: keyof SampleDataType;
}

interface SampleDataType {
  name: string;
  age: number;
}

describe("CustomTable", () => {
  test("renders columns correctly", () => {
    render(
      <CustomTable<SampleDataType>
        columns={sampleColumns}
        dataSource={dataSource}
        loading={false}
        pagination={{ pageSize: 2 }}
      />
    );
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Age")).toBeInTheDocument();
  });

  test("renders rows correctly", () => {
    render(
      <CustomTable<SampleDataType>
        columns={sampleColumns}
        dataSource={dataSource}
        loading={false}
        pagination={{ pageSize: 2 }}
      />
    );
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Jane")).toBeInTheDocument();
  });

  test("pagination works correctly", () => {
    render(
      <CustomTable<SampleDataType>
        columns={sampleColumns}
        dataSource={dataSource}
        loading={false}
        pagination={{ pageSize: 2 }}
      />
    );
    fireEvent.click(screen.getByText(">"));
    expect(screen.getByText("Doe")).toBeInTheDocument();
  });

  test("shows loader when loading is true", () => {
    render(
      <CustomTable<SampleDataType>
        columns={sampleColumns}
        dataSource={dataSource}
        loading={true}
        pagination={{ pageSize: 2 }}
      />
    );
    const { container } = render(
      <CustomTable columns={sampleColumns} dataSource={dataSource} pagination={{ pageSize: 2 }} loading={true} />
    );
    const loader = container.querySelector(`.${styles.loader}`);
    expect(loader).toBeInTheDocument();
  });
});
