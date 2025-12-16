import React from "react";

export default function FullUrlLink({ path }: { path: string }) {
  if (path.includes("..") || path.includes("./")) {
    throw new Error(
      "FullUrlLink links should provide the path of the destination URL from root, without any `./` or `..` references."
    );
  }
  if (path.includes("https") || path.includes("http")) {
    throw new Error(
      "FullUrlLink links should not be used for external URLs. Please use the default markdown syntax instead."
    );
  }

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const url = origin + path;
  return <a href={url}>{url}</a>;
}
