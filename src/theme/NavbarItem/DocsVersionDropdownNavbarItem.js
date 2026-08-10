import React from "react";
import DocsVersionDropdownNavbarItem from "@theme-original/NavbarItem/DocsVersionDropdownNavbarItem";
import { useActivePluginAndVersion } from "@docusaurus/plugin-content-docs/client";
import { useLocation } from "@docusaurus/router";

function matchesAnyPrefix(pathname, prefix) {
  if (!prefix) {
    return false;
  }
  const prefixes = Array.isArray(prefix) ? prefix : [prefix];
  return prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export default function DocsVersionDropdownNavbarItemWrapper(props) {
  const { docsPluginId, showOnPathPrefix, hideOnPathPrefix, ...rest } = props;
  const pluginData = useActivePluginAndVersion();
  const { pathname } = useLocation();

  if (hideOnPathPrefix && matchesAnyPrefix(pathname, hideOnPathPrefix)) {
    return null;
  }
  if (showOnPathPrefix && !matchesAnyPrefix(pathname, showOnPathPrefix)) {
    return null;
  }

  const doesPathnameContainDocsPluginId = docsPluginId === pluginData?.activePlugin?.pluginId;
  if (!doesPathnameContainDocsPluginId) {
    return null;
  }

  return <DocsVersionDropdownNavbarItem docsPluginId={docsPluginId} {...rest} />;
}
