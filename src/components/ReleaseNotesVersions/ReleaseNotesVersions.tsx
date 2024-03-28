import React, { useEffect, useState } from "react";
import { useHistory } from "@docusaurus/router";
import Admonition from "@theme/Admonition";
import { useVersions } from "@docusaurus/plugin-content-docs/client";
import styles from "./ReleaseNotesVersions.module.scss";
import ArchivedVersions from "../../../archiveVersions.json";
import Select, { components, OptionProps } from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import useIsBrowser from "@docusaurus/useIsBrowser";

interface VersionOption {
  label: string;
  value: string;
  url: string;
  isExternal: boolean;
}

interface CustomOptionProps extends OptionProps<VersionOption, false> {}

const CustomOption: React.FC<CustomOptionProps> = (props) => {
  const {
    data: { label, isExternal },
  } = props;

  // Return the Option component with proper props spread and conditional rendering
  return (
    <components.Option {...props}>
      {label}
      {isExternal && <FontAwesomeIcon icon={faArrowUpRightFromSquare} />}
    </components.Option>
  );
};

export function ReleaseNotesVersions(): JSX.Element | null {
  const [selectedVersion, setSelectedVersion] = useState<VersionOption | null>(null);
  const history = useHistory();
  const isBrowser = useIsBrowser();
  const isExternal = isBrowser && isExternalDomain("legacy.docs.spectrocloud.com", isBrowser);

  const versionsList = useVersions("default");

  const versions: VersionOption[] = [
    ...versionsList.map(({ label, path }) => ({
      label: label === "current" ? "latest" : label,
      value: label,
      url: path === "/" ? "/release-notes" : `${path}/release-notes`,
      isExternal: path.startsWith("http"),
    })),
    ...Object.entries(ArchivedVersions).map(([versionName, versionUrl]) => ({
      label: `${versionName} `,
      value: `${versionName} `,
      url: versionUrl,
      isExternal: versionUrl.startsWith("http"),
    })),
  ];

  if (isExternal) {
    return <></>;
  }

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

    if (selectedOption?.isExternal) {
      window.open(selectedOption.url, "_blank");
    } else {
      history.push(selectedOption?.url ?? "");
    }
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

//isExternalDomain checks if the url is external
export function isExternalDomain(url: string, isBrowser: boolean): boolean {
  if (!isBrowser) {
    return false;
  } else {
    const currentDomain = window.location.hostname;
    return currentDomain.includes(url);
  }
}

export default ReleaseNotesVersions;
