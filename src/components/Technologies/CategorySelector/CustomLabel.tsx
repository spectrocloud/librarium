import React from "react";
import { Typography } from "antd";
import styles from "./CustomLabel.module.scss";

interface CustomLabelProps {
  label: string;
  className?: string;
}

export default function CustomLabel({ label, className = "" }: CustomLabelProps) {
  const { Text } = Typography;
  return (
    <>
      <div className={`${className} ${styles.customLabel}`}>
        {label}
      </div>
    </>
  );
}
