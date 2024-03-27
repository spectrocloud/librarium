import React, { useEffect, useState } from "react";
import { useHistory } from "@docusaurus/router";
import Admonition from "@theme/Admonition";
import { useVersions } from "@docusaurus/plugin-content-docs/client";
import styles from "./ReleaseNotesVersions.module.scss";
import ArchivedVersions from "../../../archiveVersions.json";
import Select, { components } from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

interface VersionOption {
  label: string;
  value: string;
  url: string;
  isExternal: boolean;
}

// Improved CustomOption with destructuring
const CustomOption = ({ data: { label, isExternal }, ...props }) => (
  <components.Option {...props}>
    {label}
    {isExternal && <FontAwesomeIcon icon={faArrowUpRightFromSquare} />}
  </components.Option>
);

export default function ReleaseNotesVersions(): JSX.Element {
  const [selectedVersion, setSelectedVersion] = useState<VersionOption | null>(null);
  const history = useHistory();
  const versionsList = useVersions("default");

  // Simplified version construction
  const versions: VersionOption[] = [
    ...versionsList.map(({ label, path }) => ({
      label: label === "current" ? "latest" : label,
      value: label,
      url: path === "/" ? "/release-notes" : `${path}/release-notes`,
      isExternal: path.startsWith("http"),
    })),
    ...Object.entries(ArchivedVersions).map(([versionName, versionUrl]) => ({
      label: versionName,
      value: versionName,
      url: versionUrl,
      isExternal: versionUrl.startsWith("http"),
    })),
  ];

  useEffect(() => {
    const savedVersion = localStorage.getItem("selectedVersion");
    if (savedVersion) {
      const savedVersionObj = versions.find((v) => v.value === savedVersion);
      if (savedVersionObj?.value !== selectedVersion?.value) {
        setSelectedVersion(savedVersionObj);
      }
    }
  }, [selectedVersion?.value]);

  const handleVersionChange = (selectedOption: VersionOption | null) => {
    setSelectedVersion(selectedOption);
    localStorage.setItem("selectedVersion", selectedOption?.value ?? "");

    if (selectedOption?.isExternal) {
      window.open(selectedOption.url, "_blank");
    } else {
      history.push(selectedOption?.url ?? "");
    }
  };

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      background: "var(--custom-release-notes-background-color)",
      color: "var(--custom-release-notes-background-font-color)",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "var(--custom-release-notes-background-font-color)",
    }),
    option: (provided, state) => ({
      ...provided,
      color: "black",
      background: state.isSelected
        ? "var(--custom-release-notes-selected-background)"
        : state.isFocused
          ? "(--custom-release-notes-active-option-hoover)"
          : "var(--custom-release-notes-background-color)",
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

// Moved isExternalDomain function outside the component for better separation of concerns
function isExternalDomain(url: string): boolean {
  const currentDomain = window.location.hostname;
  return !url.includes(currentDomain);
}
