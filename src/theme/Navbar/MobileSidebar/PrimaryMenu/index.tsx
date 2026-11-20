import React from "react";
import { useThemeConfig } from "@docusaurus/theme-common";
import { useNavbarMobileSidebar } from "@docusaurus/theme-common/internal";
import NavbarItem, { type Props as NavbarItemConfig } from "@theme/NavbarItem";

function useNavbarItems() {
  // TODO temporary casting until ThemeConfig type is improved
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return useThemeConfig().navbar.items as NavbarItemConfig[];
}

// A section link is a left-hand navbar item that opens a part of the site, such as Products or Tutorials. Version
// drop-down menus and right-hand items, such as GitHub and Ask AI, are not section links.
function isSectionLink(item: NavbarItemConfig): boolean {
  const { position, type } = item as { position?: string; type?: string };
  return position === "left" && type !== "docsVersionDropdown";
}

interface NavbarMobilePrimaryMenuProps {
  className: string;
  // Render only the section links. The strip at the bottom of the docs sidebar panel uses this, so that it stays
  // short. The main mobile menu renders every navbar item.
  sectionLinksOnly?: boolean;
}

// The primary menu displays the navbar items
export default function NavbarMobilePrimaryMenu({
  className,
  sectionLinksOnly = false,
}: NavbarMobilePrimaryMenuProps): JSX.Element {
  const mobileSidebar = useNavbarMobileSidebar();

  // TODO how can the order be defined for mobile?
  // Should we allow providing a different list of items?
  const items = useNavbarItems().filter((item) => !sectionLinksOnly || isSectionLink(item));

  return (
    <ul className={`menu__list ${className ? className : ""}`}>
      {items.map((item, i) => (
        <NavbarItem mobile {...item} onClick={() => mobileSidebar.toggle()} key={i} />
      ))}
    </ul>
  );
}
