import React from "react";
import { useThemeConfig } from "@docusaurus/theme-common";
import { splitNavbarItems, useNavbarMobileSidebar } from "@docusaurus/theme-common/internal";
import NavbarItem from "@theme/NavbarItem";

function useNavbarItems() {
  // TODO temporary casting until ThemeConfig type is improved
  return useThemeConfig().navbar.items;
}

interface NavbarMobilePrimaryMenuProps {
  className: string;
}

// The primary menu displays the navbar items
export default function NavbarMobilePrimaryMenu({ className }: NavbarMobilePrimaryMenuProps): JSX.Element {
  const mobileSidebar = useNavbarMobileSidebar();

  // TODO how can the order be defined for mobile?
  // Should we allow providing a different list of items?
  const [items] = splitNavbarItems(useNavbarItems());

  return (
    <ul className={`menu__list ${className ? className : ""}`}>
      {items.map((item, i) => (
        <NavbarItem mobile {...item} onClick={() => mobileSidebar.toggle()} key={i} />
      ))}
    </ul>
  );
}
