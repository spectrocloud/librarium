import { useActivePluginAndVersion } from "@docusaurus/plugin-content-docs/client";

export default function GetVersion(): string {
  const activePlugin = useActivePluginAndVersion();
  if (activePlugin != undefined && activePlugin.activeVersion != undefined) {
    return activePlugin.activeVersion.name;
  }

  return "";
}
