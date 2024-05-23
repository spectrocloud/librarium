import { useActivePluginAndVersion } from "@docusaurus/plugin-content-docs/client";

export default function GetVersionPath() {
  const activePlugin = useActivePluginAndVersion();
  if (
    activePlugin != undefined &&
    activePlugin.activeVersion != undefined &&
    activePlugin.activeVersion.name != "current"
  ) {
    return activePlugin.activeVersion.path;
  }

  return "";
}
