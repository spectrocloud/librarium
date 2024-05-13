import React from "react";
import GetVersionPath from "./CheckVersion";

interface ComponentProperties {
  [key: string]: string;
}

export default function VersionedLink(props: ComponentProperties) {
  const path = GetVersionPath();
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
  if (path != "") {
    const versionedURL = path.concat(props.url);
    return <a href={versionedURL}>{props.text}</a>;
  }

  return <a href={props.url}>{props.text}</a>;
}
