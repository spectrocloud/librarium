import React from "react";
import DocsVersionDropdownNavbarItem from "@theme-original/NavbarItem/DocsVersionDropdownNavbarItem";
import { useActivePluginAndVersion } from "@docusaurus/plugin-content-docs/client";

export default function DocsVersionDropdownNavbarItemWrapper(props) {
  const { docsPluginId } = props;
  const pluginData = useActivePluginAndVersion();
  const doesPathnameContainDocsPluginId = docsPluginId === pluginData?.activePlugin?.pluginId;

  if (!doesPathnameContainDocsPluginId) {
    return null;
  }
  return (
    <>
      <DocsVersionDropdownNavbarItem {...props} />
    </>
  );
}
