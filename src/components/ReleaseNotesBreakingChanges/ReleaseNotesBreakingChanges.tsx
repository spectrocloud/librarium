/* eslint-disable */

import React, { useEffect, useState } from "react";
import { useHistory } from "@docusaurus/router";
import Admonition from "@theme/Admonition";
import { useVersions } from "@docusaurus/plugin-content-docs/client";
import styles from "./ReleaseNotesBreakingChanges.module.scss";
import ArchivedVersions from "../../../archiveVersions.json";
import Select, { components, OptionProps } from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import useIsBrowser from "@docusaurus/useIsBrowser";

interface VersionOption {
  label: string;
  value: string;
}

interface CustomOptionProps extends OptionProps<VersionOption, false> {}

const CustomOption: React.FC<CustomOptionProps> = (props) => {
  const {
    data: { label },
  } = props;

  // Return the Option component with proper props spread and conditional rendering
  return (
    <components.Option {...props}>
      {label}
    </components.Option>
  );
};

export function ReleaseNotesBreakingChanges(): JSX.Element | null {
  const [selectedVersion, setSelectedVersion] = useState<VersionOption | null>(null);
  const versionsList = useVersions("default");

  const versions: VersionOption[] = [
    ...versionsList.map(({ label, path }) => ({
      label: label === "current" ? "latest" : label,
      value: label,
    })),
    ...Object.entries(ArchivedVersions).map(([versionName, versionUrl]) => ({
      label: `${versionName} `,
      value: `${versionName} `,
    })),
  ];

  useEffect(() => {
    const savedVersion = localStorage.getItem("selectedVersion");
    if (savedVersion) {
      const savedVersionObj: any = versions.find((v) => v.value === savedVersion);
      if (savedVersionObj?.value !== selectedVersion?.value) {
        setSelectedVersion(savedVersionObj);
      }
    }
  }, [selectedVersion?.value]);


  const handleVersionChange = (selectedOption: VersionOption | null) => {
    setSelectedVersion(selectedOption);
    localStorage.setItem("selectedVersion", selectedOption?.value ?? "");
  };

  const customSelectStyles = {
    control: (provided: any) => ({
      ...provided,
      background: "var(--custom-release-notes-background-color)",
      color: "var(--custom-release-notes-background-font-color)",
      boxShadow: "none",
    }),
    menu: (provided: any) => ({
      ...provided,
      marginTop: "0",
      backgroundColor: "var(--custom-release-notes-menu-padding)",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "var(--custom-release-notes-background-font-color)",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      borderRadius: "0.25rem",
      color: "var(--custom-release-notes-option-font-color)",
      background: state.isSelected
        ? "var(--custom-release-notes-selected-background)"
        : state.isFocused
          ? "var(--custom-release-notes-active-option-hover)"
          : "var(--custom-release-notes-background-color)",
    }),
  };

  return (
    <Admonition type="info" title="Breaking Changes">
      <p>
        Use the version selector below to find all the breaking changes between two releases.
      </p>
      <div className={styles.dropdownContainer}>
        <div className={styles.dropdownGroupFirst}>
          <label className={styles.dropdownLabel} htmlFor="version-select-1">Current Version:</label>
          <Select
            inputId="version-select-1"
            classNamePrefix="reactSelect"
            onChange={handleVersionChange}
            value={selectedVersion}
            options={versions}
            components={{ Option: CustomOption }}
            styles={customSelectStyles}
          />
        </div>
        <div className={styles.arrowContainer}>
          <FontAwesomeIcon icon={faArrowRight} />
        </div>
        <div className={styles.dropdownGroupSecond}>
          <label className={styles.dropdownLabel} htmlFor="version-select-2">Version to Upgrade to:</label>
          <Select
            inputId="version-select-2"
            classNamePrefix="reactSelect"
            onChange={handleVersionChange}
            value={selectedVersion}
            options={versions}
            components={{ Option: CustomOption }}
            styles={customSelectStyles}
          />
        </div>
      </div>
    </Admonition>
  );
}

export default ReleaseNotesBreakingChanges;
