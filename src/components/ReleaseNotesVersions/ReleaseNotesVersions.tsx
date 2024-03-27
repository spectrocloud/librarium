import React, { useEffect, useState } from "react";
import { useHistory } from "@docusaurus/router";
import Admonition from "@theme/Admonition";
import { useVersions } from "@docusaurus/plugin-content-docs/client"; // This hook should be called at the top level.
import styles from "./ReleaseNotesVersions.module.scss";
import ArchivedVersions from "../../../archiveVersions.json";
import useIsBrowser from "@docusaurus/useIsBrowser";
import Select, { components } from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

type VersionURL = string;

interface VersionOption {
  label: string;
  value: string;
  url: VersionURL;
  isExternal: boolean;
}

const CustomOption = (props: any) => {
  return (
    <components.Option {...props}>
      {props.data.label}
      {props.data.isExternal ? <FontAwesomeIcon icon={faArrowUpRightFromSquare} /> : null}
    </components.Option>
  );
};

export default function ReleaseNotesVersions(): JSX.Element {
  const [selectedVersion, setSelectedVersion] = useState<VersionOption | null>(null);
  const isBrowser = useIsBrowser();
  const history = useHistory();
  const versionsList = useVersions("default"); // Moved useVersions to top level

  // Create versions array without useMemo, directly in the component body
  const versions: VersionOption[] =
    versionsList.map((version) => ({
      label: version.label === "current" ? "latest" : version.label,
      value: version.label,
      url: version.path === "/" ? "/release-notes" : `${version.path}/release-notes`,
      isExternal: version.path.startsWith("http"),
    })) || [];

  Object.entries(ArchivedVersions).forEach(([versionName, versionUrl]: [string, VersionURL]) => {
    versions.push({
      label: versionName + " ",
      value: versionName + " ",
      url: versionUrl,
      isExternal: versionUrl.startsWith("http"),
    });
  });

  useEffect(() => {
    const savedVersion = localStorage.getItem("selectedVersion");
    if (savedVersion) {
      const savedVersionObj = versions.find((v) => v.value === savedVersion);
      if (savedVersionObj && savedVersionObj.value !== selectedVersion?.value) {
        setSelectedVersion(savedVersionObj);
      }
    }
  }, [versions, selectedVersion?.value]);

  const handleVersionChange = (selectedOption: VersionOption | null) => {
    setSelectedVersion(selectedOption);
    localStorage.setItem("selectedVersion", selectedOption?.value || "");

    if (selectedOption?.isExternal) {
      window.open(selectedOption.url + "/release-notes", "_blank");
    } else {
      history.push(selectedOption?.url || "");
    }
  };

  const customSelectStyles = {
    option: (provided: any) => ({
      ...provided,
      background: "var(--ifm-alert-background-color)",
      color: "var(--ifm-alert-foreground-color)",
    }),
  };

  return (
    <Admonition type="tip">
      <p>
        Are you looking for the release notes to a specific version of Palette? Use the version selector below to
        navigate to the release notes of the desired version.
      </p>
      <div className={styles.dropdownContainer}>
        <Select
          classNamePrefix="reactSelect"
          onChange={handleVersionChange}
          value={selectedVersion}
          options={versions}
          components={{ Option: CustomOption }}
          styles={customSelectStyles}
        />
      </div>
    </Admonition>
  );
}

function isExternalDomain(url: string, isBrowser: boolean): boolean {
  if (!isBrowser) {
    return false;
  } else {
    const currentDomain = window.location.hostname;
    return !currentDomain.includes(url);
  }
}
