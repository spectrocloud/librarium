import ThemedImage from "@theme/ThemedImage";
import React from "react";
import styles from "./TechnicalPreviewReleaseNote.module.scss";

export default function TechnicalPreviewReleaseNote() {
  return (
    <ThemedImage
      alt="Technical preview feature"
      sources={{
        light: "/img/tech-preview-dark.svg",
        dark: "/img/tech-preview-light.svg",
      }}
      className={styles.customTpReleaseNoteBadge}
    />
  );
}
