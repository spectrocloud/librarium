import React, { useEffect, useState } from "react";
import { useHistory } from "@docusaurus/router";
import Admonition from "@theme/Admonition";
import { useVersions } from "@docusaurus/plugin-content-docs/client"; // Adjusted import for useVersions
import styles from "./ReleaseNotesVersions.module.scss";
import ArchivedVersions from "../../../archiveVersions.json";
import useIsBrowser from "@docusaurus/useIsBrowser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

type VersionName = string;
type VersionURL = string;

interface Version {
  name: VersionName;
  url: VersionURL;
}

function isExternalDomain(url: string, isBrowser: boolean): boolean {
  if (!isBrowser) {
    return false;
  } else {
    const currentDomain = window.location.hostname;
    return currentDomain.includes(url);
  }
}

export default function ReleaseNotesVersions(): JSX.Element {
  const [selectedVersion, setSelectedVersion] = useState<string>("");
  const isBrowser = useIsBrowser();
  const isExternal = isBrowser && isExternalDomain("legacy.docs.spectrocloud.com", isBrowser);
  const history = useHistory();
  const versionsList = useVersions("default"); // Now returns an array of GlobalVersion
  console.log(versionsList);
  useEffect(() => {
    const savedVersion = localStorage.getItem("selectedVersion");
    if (savedVersion) {
      setSelectedVersion(savedVersion);
    }
  }, []);

  if (isExternal) {
    return <></>;
  }

  // Map through versionsList to construct the versions array
  const versions: Version[] = versionsList.map((version) => ({
    name: version.label === "current" ? "latest" : version.label,
    url: version.path === "/" ? "/release-notes" : `${version.path}/release-notes`,
  }));
  console.log(versions);

  // Add archived versions
  Object.entries(ArchivedVersions).forEach(([versionName, versionUrl]: [VersionName, VersionURL]) => {
    versions.push({ name: versionName, url: versionUrl });
  });

  const handleVersionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSelectedVersion = event.target.value;
    localStorage.setItem("selectedVersion", newSelectedVersion);
    setSelectedVersion(newSelectedVersion);

    const selectedVersionObject = versions.find((version) => version.name === newSelectedVersion);
    if (selectedVersionObject) {
      if (selectedVersionObject.url.startsWith("http")) {
        window.open(selectedVersionObject.url + "/release-notes", "_blank");
      } else {
        history.push(selectedVersionObject.url);
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
        <select className={styles.dropdown} onChange={handleVersionChange} value={selectedVersion}>
          <option value="" disabled>
            Select Version
          </option>
          {versions.map((version: Version) => (
            <option key={version.name} value={version.name}>
              {version.url.startsWith("http") ? version.name + " (External)" : version.name}
            </option>
          ))}
        </select>
      </div>
    </Admonition>
  );
}
