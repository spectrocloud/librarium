import React from "react";
import { useThemeConfig } from "@docusaurus/theme-common";
import { useNavbarMobileSidebar } from "@docusaurus/theme-common/internal";
import NavbarItem, { type Props as NavbarItemConfig } from "@theme/NavbarItem";

function useNavbarItems() {
  // TODO temporary casting until ThemeConfig type is improved
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return useThemeConfig().navbar.items as NavbarItemConfig[];
}

interface NavbarMobilePrimaryMenuProps {
  className: string;
}

// The primary menu displays the navbar items
export default function NavbarMobilePrimaryMenu({ className }: NavbarMobilePrimaryMenuProps): JSX.Element {
  const mobileSidebar = useNavbarMobileSidebar();

  // TODO how can the order be defined for mobile?
  // Should we allow providing a different list of items?
  const items = useNavbarItems();

  return (
    <ul className={`menu__list ${className ? className : ""}`}>
      {items.map((item, i) => (
        <NavbarItem mobile {...item} onClick={() => mobileSidebar.toggle()} key={i} />
      ))}
    </ul>
  );
}
