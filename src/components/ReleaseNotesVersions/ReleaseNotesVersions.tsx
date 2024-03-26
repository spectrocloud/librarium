import React from "react";
import { useHistory } from "@docusaurus/router";
import Admonition from "@theme/Admonition";
import { useActivePluginAndVersion } from "@docusaurus/plugin-content-docs/client";
import styles from "./ReleaseNotesVersions.module.scss";
import ArchivedVersions from "../../../archiveVersions.json";

type VersionName = string;
type VersionURL = string;
interface Version {
  name: VersionName;
  url: VersionURL;
}

interface GlobalVersion {
  name: VersionName;
  url: VersionURL;
}

interface PluginData {
  activePlugin?: {
    pluginData?: {
      versions?: Version[];
    };
  };
}

// Check if the domain is external.
function isExternalDomain(url: string = "legacy.docs.spectrocloud.com"): boolean {
  const currentDomain = window.location.hostname;
  // check if the domain contains the specified URL
  return currentDomain.includes(url);
}

export default function ReleaseNotesVersions(): JSX.Element {
  const pluginData: GlobalVersion | undefined = useActivePluginAndVersion();

  const isExternal: boolean = isExternalDomain("legacy.docs.spectrocloud.com");

  if (isExternal) {
    // If the domain is external, return an empty element to avoid rendering the component.
    // The external domain used for achived versions is "legacy.docs.spectrocloud.com" is not aware of new versions.
    return <></>;
  }

  // Extracting versions from pluginData
  const versions: Version[] = (pluginData?.activePlugin?.pluginData?.versions ?? []).map((version: Version) => ({
    name: version.name === "current" ? "latest" : version.name, // Rename "current" to "latest"
    url: version.name === "current" ? "/release-notes" : `/${version.name}/release-notes`, // Adjust URL accordingly
  }));

  // Adding archived versions from JSON file
  Object.entries(ArchivedVersions).forEach(([versionName, versionUrl]: [VersionName, VersionURL]) => {
    versions.push({ name: versionName, url: versionUrl });
  });

  const history = useHistory();

  const handleVersionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedVersion = event.target.value;
    if (selectedVersion === "latest") {
      history.push(`/release-notes`);
    } else {
      const selectedVersionObject = versions.find((version) => version.name === selectedVersion);
      if (selectedVersionObject) {
        const { name, url } = selectedVersionObject;
        if (url.startsWith("http")) {
          window.open(url + "/release-notes", "_blank");
        } else {
          history.push(url);
        }
      }
    }
  };

  return (
    <Admonition type="tip">
      <p>
        Are you looking for the release notes to a specific version of Palette? Use the version selector below to
        navigate to the release notes of the desired version.
      </p>
      <div className={styles.dropdownContainer}>
        <select className={styles.dropdown} onChange={handleVersionChange} defaultValue="">
          <option value="" disabled>
            Select Version
          </option>
          {versions.map((version: Version) => (
            <option key={version.name} value={version.name}>
              {version.name}
            </option>
          ))}
        </select>
      </div>
    </Admonition>
  );
}
