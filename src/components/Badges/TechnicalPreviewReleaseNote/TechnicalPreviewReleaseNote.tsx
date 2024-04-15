import React from "react";
import ThemedImage from "@theme/ThemedImage";
import styles from "./TechnicalPreviewReleaseNote.module.scss";

// define type for TechnicalPreviewReleaseNote

export default function TechnicalPreviewReleaseNote() {
  return (
    <ThemedImage
      alt="Technical preview feature badge"
      sources={{
        light: "/img/tech-preview-dark.svg",
        dark: "/img/tech-preview-light.svg",
      }}
      className={styles.customTpReleaseNoteBadge}
    />
  );
}
