/**
 * Swizzled from @docusaurus/theme-classic.
 *
 * Adds a landing-page mode: on the routes listed in LANDING_ROUTES the docs
 * sidebar is not rendered and the content spans the full width, so the page
 * reads as a standalone landing page instead of an article. The table of
 * contents is removed separately via `hide_table_of_contents` frontmatter, and
 * breadcrumbs are hidden through the landing styles below.
 */
import React, { useState } from "react";
import clsx from "clsx";
import { useLocation } from "@docusaurus/router";
import { useDocsSidebar } from "@docusaurus/plugin-content-docs/client";
import BackToTopButton from "@theme/BackToTopButton";
import DocRootLayoutSidebar from "@theme/DocRoot/Layout/Sidebar";
import DocRootLayoutMain from "@theme/DocRoot/Layout/Main";
import styles from "./styles.module.css";

// Routes (without trailing slash) that render as standalone landing pages.
const LANDING_ROUTES = [""];

function normalize(pathname) {
  return pathname.replace(/\/+$/, "");
}

export default function DocRootLayout({ children }) {
  const sidebar = useDocsSidebar();
  const location = useLocation();
  const [hiddenSidebarContainer, setHiddenSidebarContainer] = useState(false);

  const isLanding = LANDING_ROUTES.includes(normalize(location.pathname));

  if (isLanding) {
    return (
      <div className={styles.docsWrapper}>
        <div className={styles.docRoot}>
          <main className={clsx(styles.landingMain)}>
            <div className="container padding-top--md padding-bottom--lg">{children}</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.docsWrapper}>
      <BackToTopButton />
      <div className={styles.docRoot}>
        {sidebar && (
          <DocRootLayoutSidebar
            sidebar={sidebar.items}
            hiddenSidebarContainer={hiddenSidebarContainer}
            setHiddenSidebarContainer={setHiddenSidebarContainer}
          />
        )}
        <DocRootLayoutMain hiddenSidebarContainer={hiddenSidebarContainer}>{children}</DocRootLayoutMain>
      </div>
    </div>
  );
}
