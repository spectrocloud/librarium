import React from "react";
import DropdownNavbarItem from "@theme-original/NavbarItem/DropdownNavbarItem";
import { useLocation } from "@docusaurus/router";

function matchesAnyPrefix(pathname, prefix) {
  if (!prefix) {
    return false;
  }
  const prefixes = Array.isArray(prefix) ? prefix : [prefix];
  return prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export default function DropdownNavbarItemWrapper(props) {
  const { showOnPathPrefix, hideOnPathPrefix, ...rest } = props;
  const { pathname } = useLocation();

  if (hideOnPathPrefix && matchesAnyPrefix(pathname, hideOnPathPrefix)) {
    return null;
  }
  if (showOnPathPrefix && !matchesAnyPrefix(pathname, showOnPathPrefix)) {
    return null;
  }

  return <DropdownNavbarItem {...rest} />;
}
