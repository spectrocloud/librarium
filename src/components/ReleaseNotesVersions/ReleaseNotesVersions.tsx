import React from "react";
import Admonition from "@theme/Admonition";
import DocsVersionDropdownNavbarItem from "@theme-original/NavbarItem/DocsVersionDropdownNavbarItem";
import { useActivePluginAndVersion } from "@docusaurus/plugin-content-docs/client";

export default function ReleaseNotesVersions() {
  const pluginData = useActivePluginAndVersion();
  // const doesPathnameContainDocsPluginId = "docs" === pluginData?.activePlugin?.pluginId;
  pluginData?.activePlugin && console.log(pluginData.activePlugin);
  return (
    <Admonition type="tip">
      <p>
        Are you looking for the release notes to a specific version of Palette? Use the version selector{" "}
        <strong>drop-down Menu</strong> located at the top left side of the page to navigate to the release notes for
        the version you are interested in.
      </p>
    </Admonition>
  );
}
