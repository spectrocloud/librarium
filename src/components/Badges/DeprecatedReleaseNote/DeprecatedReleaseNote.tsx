import React from "react";
import ThemedImage from "@theme/ThemedImage";
import styles from "./DeprecatedReleaseNote.module.scss";

export default function DeprecatedReleaseNote() {
  return (
    <ThemedImage
      alt="Deprecated feature badge"
      sources={{
        light: "/img/deprecated-dark.svg",
        dark: "/img/deprecated-light.svg",
      }}
      className={styles.customDeprecatedReleaseNoteBadge}
    />
  );
}
