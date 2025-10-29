import React from "react";

interface ComponentProperties {
  text?: string;
  url: string;
  component?: React.ReactElement;
}

export default function VersionedLink(props: ComponentProperties) {
  if (props.url.includes("..") || props.url.includes("./")) {
    throw new Error(
      "Versioned links should provide the path of the destination URL from root, without any `./` or `..` references."
    );
  }
  if (props.url.includes("https") || props.url.includes("http")) {
    throw new Error(
      "Versioned links should not be used for external URLs. Please use the default markdown syntax instead."
    );
  }

  // Component mode of versioned link detected without versioning
  if (props.component != null) {
    return (
      <a className={styles.inlineVersionedLink} href={props.url}>
        {props.component}
      </a>
    );
  }

  return (
    <a className={styles.inlineVersionedLink} href={props.url}>
      {props.text}
    </a>
  );
}
