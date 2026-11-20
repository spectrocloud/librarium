import React from "react";
import NavbarItem from "@theme-original/NavbarItem";
import { useLocation } from "@docusaurus/router";
import useBaseUrl from "@docusaurus/useBaseUrl";

// Leaves out navbar items marked `hideOnHomepage: true` in docusaurus.config.js while the homepage is open, on desktop
// and in the mobile menu. The flag is removed before the item renders, so it never reaches the DOM.
export default function NavbarItemWrapper({ hideOnHomepage, ...props }) {
  const { pathname } = useLocation();
  const homepagePath = useBaseUrl("/");

  if (hideOnHomepage && pathname === homepagePath) {
    return null;
  }
  return <NavbarItem {...props} />;
}
