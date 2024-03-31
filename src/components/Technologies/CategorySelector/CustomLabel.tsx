import React from "react";
import { Typography } from "antd";
import styles from "./CustomLabel.module.scss";

interface CustomLabelProps {
  label: string;
}

export default function CustomLabel({ label }: CustomLabelProps) {
  const { Text } = Typography;
  return (
    <div className={styles.customLabel}>
      <Text>{label}</Text>
    </div>
  );
}
