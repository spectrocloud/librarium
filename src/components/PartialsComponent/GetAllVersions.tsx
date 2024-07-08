import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { Config } from "@docusaurus/types";

export default function GetVersions(): string[] {
  const { siteConfig } = useDocusaurusContext();
  const cfg = siteConfig as Config;
  if (cfg.presets != undefined) {
    // Linting is disabled for next line, as there is no type for docs config.
    // eslint-disable-next-line  @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
    const versions = cfg.presets[0][1]["docs"]["versions"] as object;
    const versionNames: string[] = Object.keys(versions);
    return versionNames;
  }
  // if no presets, then default to "current"
  return ["current"];
}
