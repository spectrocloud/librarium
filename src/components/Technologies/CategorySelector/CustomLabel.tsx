import React from "react";
import styles from "./CustomLabel.module.scss";

interface CustomLabelProps {
  label: string;
  className?: string;
}

export default function CustomLabel({ label, className = "" }: CustomLabelProps) {
  return (
    <>
      <div className={`${className} ${styles.customLabel}`}>
        {label}
      </div>
    </>
  );
}
