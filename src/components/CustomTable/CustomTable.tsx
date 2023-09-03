import React, { useState } from "react";
import styles from "./CustomTable.module.scss";

interface Column<T> {
  title: string;
  dataIndex: keyof T;
  sorter?: (a: T, b: T) => number;
  render?: (value: any, row: T) => React.ReactNode;
  width?: number | string;
}

interface CustomTableProps<T> {
  columns: Column<T>[];
  dataSource: T[];
  className?: string;
  loading?: boolean;
  pagination: {
    pageSize: number;
  };
  scrollY?: number;
}

const CustomTable = <T,>({
  columns,
  dataSource,
  loading = false,
  pagination,
  className,
  scrollY,
}: CustomTableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const startRow = (currentPage - 1) * pagination.pageSize;
  const endRow = startRow + pagination.pageSize;
  const currentData = dataSource.slice(startRow, endRow);

  const totalPages = Math.ceil(dataSource.length / pagination.pageSize);

  return (
    <div>
      {!loading ? (
        <>
          <div
            style={{ overflowY: "auto", height: `${scrollY}px` }}
            className={styles.tableWrapper}
          >
            <table className={className}>
              <thead>
                <tr>
                  {columns.map((col, index) => (
                    <th key={index} style={{ width: col.width }}>
                      {col.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentData.map((row, index) => (
                  <tr key={index}>
                    {columns.map((col, index) => (
                      <td key={index}>
                        {col.render
                          ? col.render(row[col.dataIndex], row)
                          : (row[col.dataIndex] as React.ReactNode)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.pagination}>
            <button
              className={styles.paginationButton}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              &lt;
            </button>
            {[...Array(totalPages).keys()].map((page, index) => (
              <button
                className={`${styles.paginationButton} ${
                  currentPage === index + 1 ? styles.activePage : ""
                } `}
                key={index}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className={styles.paginationButton}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              &gt;
            </button>
          </div>
        </>
      ) : (
        <Loader></Loader>
      )}
    </div>
  );
};

export default CustomTable;

function Loader() {
  return <div className={`${styles.loader} "loader"`}></div>;
}
