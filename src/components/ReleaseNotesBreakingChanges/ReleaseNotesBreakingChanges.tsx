import React, { useEffect, useState, FunctionComponent, useMemo } from "react";
import styles from "./ReleaseNotesBreakingChanges.module.scss";
import Versions from "./versions.json";
import Select, { components, OptionProps } from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import useIsBrowser from "@docusaurus/useIsBrowser";
import Admonition from "@theme/Admonition";
import Link from "@docusaurus/Link";
import PartialsComponent from "../PartialsComponent";

interface VersionOption {
  label: string;
  value: string;
}

 interface Modules {
  [key: string]: Module;
}

interface Module {
  frontMatter: {
    partial_category: string;
    partial_name: string;
  };
  default: FunctionComponent;
}

const externalDomainURL = "legacy.docs.spectrocloud.com";


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

function compareVersions(a: string, b: string, direction: 'ASC' | 'DESC' = 'DESC'): number {
  const aParts = a.split('.').map(Number);
  const bParts = b.split('.').map(Number);

  for (let i = 0; i < 3; i++) {
    const aVal = aParts[i] || 0;
    const bVal = bParts[i] || 0;

    if (aVal !== bVal) {
      return direction === 'ASC' ? aVal - bVal : bVal - aVal;
    }
  }

  return 0; // equal
}


function isGreaterVersion(a: string, b: string): boolean {
  const aParts = a.split('.').map(Number);
  const bParts = b.split('.').map(Number);

  for (let i = 0; i < 3; i++) {
    const aVal = aParts[i] || 0;
    const bVal = bParts[i] || 0;
    if (aVal > bVal) return true;
    if (aVal < bVal) return false;
  }

  return false; // equal
}

function isVersionInRange(input: string, from: string, to: string): boolean {
  const parse = (v: string) => v.split('.').map(Number);

  const [iMajor, iMinor, iPatch] = parse(input);
  const [fMajor, fMinor, fPatch] = parse(from);
  const [tMajor, tMinor, tPatch] = parse(to);

  const isStrictlyGreaterThanFrom =
    iMajor > fMajor ||
    (iMajor === fMajor && iMinor > fMinor) ||
    (iMajor === fMajor && iMinor === fMinor && iPatch > fPatch);

  const isLessThanOrEqualToTo =
    iMajor < tMajor ||
    (iMajor === tMajor && iMinor < tMinor) ||
    (iMajor === tMajor && iMinor === tMinor && iPatch <= tPatch);

  return isStrictlyGreaterThanFrom && isLessThanOrEqualToTo;
}


function getVersionsFromFile(): string[] {
  const versions: string[] = Versions;
  versions.sort((a, b) => compareVersions(a, b, 'DESC'));
  return versions;
}

function getBreakingChangesBetweenVersions(from:string, to:string): string[] {
  let breakingVersionsList: string[] = [];
  const module: Modules = require("@site/_partials");
  const partialKeys: string[] = Object.keys(module);
  partialKeys.map(function (pkey) {
    const currentPartial: Module = module[pkey];
    const catFrontMatter = currentPartial.frontMatter.partial_category;
    const nameFrontMatter = currentPartial.frontMatter.partial_name.toString();
    if (catFrontMatter == "breaking-changes" && isVersionInRange(nameFrontMatter, from, to)) {
      breakingVersionsList.push(nameFrontMatter);
    }
  });
  
  breakingVersionsList.sort((a, b) => compareVersions(a, b, 'ASC'));
  return breakingVersionsList;
}

export function ReleaseNotesBreakingChanges(): JSX.Element | null {
  const [selectedFromVersion, setSelectedFromVersion] = useState<VersionOption | null>(null);
  const [selectedToVersion, setSelectedToVersion] = useState<VersionOption | null>(null);
  const versionsList = getVersionsFromFile();
  const breakingVersionsList = useMemo(() => {
    if (!selectedFromVersion || !selectedToVersion) return [];
    return getBreakingChangesBetweenVersions(selectedFromVersion.value, selectedToVersion.value);
  }, [selectedFromVersion, selectedToVersion]);


  const versions: VersionOption[] = [
    ...versionsList.map(( version) => ({
      label: version,
      value: version,
    })),
  ];

  const toVersionOptions = useMemo(() => {
    if (!selectedFromVersion) return versions;
  
    return versions.filter(v => isGreaterVersion(v.value, selectedFromVersion.value));
  }, [selectedFromVersion, versions]);

  useEffect(() => {
    if (
      selectedFromVersion &&
      selectedToVersion &&
      !isGreaterVersion(selectedToVersion.value, selectedFromVersion.value)
    ) {
      setSelectedToVersion(null);
      localStorage.removeItem("selectedToVersion");
    }
  }, [selectedFromVersion, selectedToVersion]);

  useEffect(() => {
    const savedFromVersion = localStorage.getItem("selectedFromVersion");
    if (savedFromVersion) {
      const savedFromVersionObj = versions.find((v) => v.value === savedFromVersion) || null;
      if (savedFromVersionObj && savedFromVersionObj.value !== selectedFromVersion?.value) {
        setSelectedFromVersion(savedFromVersionObj);
      }

    }
  }, [versions]);

  useEffect(() => {
    const savedToVersion = localStorage.getItem("selectedToVersion");
    if (savedToVersion) {
      const savedToVersionObj = versions.find((v) => v.value === savedToVersion) || null;
      if (savedToVersionObj && savedToVersionObj.value !== selectedToVersion?.value) {
        setSelectedToVersion(savedToVersionObj);
      }
    }
  }, [versions]);


  const handleFromVersionChange = (selectedOption: VersionOption | null) => {
    setSelectedFromVersion(selectedOption);
    localStorage.setItem("selectedFromVersion", selectedOption?.value ?? "");
  };
  const handleToVersionChange = (selectedOption: VersionOption | null) => {
    setSelectedToVersion(selectedOption);
    localStorage.setItem("selectedToVersion", selectedOption?.value ?? "");
  };

  const customSelectStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      background: "var(--custom-release-notes-background-color)",
      color: "var(--custom-release-notes-background-font-color)",
      boxShadow: "none",
      cursor: state.isDisabled ? "not-allowed" : "default",
      opacity: state.isDisabled ? 0.6 : 1,
    }),
    container: (provided: any, state: any) => ({
      ...provided,
      cursor: state.isDisabled ? "not-allowed" : "default",
    }),
    valueContainer: (provided: any, state: any) => ({
      ...provided,
      cursor: state.isDisabled ? "not-allowed" : "default",
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
      cursor: state.isDisabled ? "not-allowed" : "pointer",
      background: state.isSelected
        ? "var(--custom-release-notes-selected-background)"
        : state.isFocused
          ? "var(--custom-release-notes-active-option-hover)"
          : "var(--custom-release-notes-background-color)",
    }),
  };

  if (isLegacy(externalDomainURL, useIsBrowser())) {
    return (
      <Admonition type="tip">
        To find breaking changes between releases, check out the most recent
        <Link href="https://docs.spectrocloud.com/release-notes/breaking-changes"> Palette breaking changes.</Link>.
      </Admonition>
    );
  }

  return (
    <div>
      <div className={styles.breakingChangesContainer}>
        <p>
          Use the version selector below to find all the breaking changes between two releases. <br/> Start by selecting the current version you have installed.
        </p>
        <div className={styles.dropdownContainer}>
          <div className={styles.dropdownGroupFirst}>
            <label className={styles.dropdownLabel} htmlFor="version-select-1">Current Version:</label>
            <Select
              inputId="version-select-1"
              classNamePrefix="reactSelect"
              onChange={handleFromVersionChange}
              value={selectedFromVersion}
              options={versions}
              components={{ Option: CustomOption }}
              styles={customSelectStyles}
            />
          </div>
          <div className={styles.arrowContainer}>
            <FontAwesomeIcon icon={faArrowRight} />
          </div>
          <div className={styles.dropdownGroupSecond}>
            <label className={styles.dropdownLabel} htmlFor="version-select-2"> Target Version:</label>
            <Select
              inputId="version-select-2"
              classNamePrefix="reactSelect"
              onChange={handleToVersionChange}
              isDisabled={!selectedFromVersion}
              value={selectedToVersion}
              options={toVersionOptions}
              components={{ Option: CustomOption }}
              styles={customSelectStyles}
            />
          </div>
        </div>
      </div>
      {selectedFromVersion && selectedToVersion && (
        <div className={styles.breakingChangesTextContainer}>
          <h3>
            Breaking Changes from <strong>{selectedFromVersion.label}</strong> to <strong>{selectedToVersion.label}</strong>
          </h3>
          <br/>
          {breakingVersionsList.length === 0 ? (
            <div>No breaking changes found.</div>
          ) : (
            breakingVersionsList.map((version) => (
              <div key={version}>
                <div className={styles.breakingChangeTitle}>{version}</div>
                <PartialsComponent category="breaking-changes" name={version} />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// isLegacy checks if the URL is external or points to a versioned page.
export function isLegacy(url: string, isBrowser: boolean): boolean {
  if (!isBrowser) {
    return false;
  }

  const currentDomain = window.location.hostname;

  // Regex: matches versions like 4.6.x, 5.7.x, 12.34.x
  const versionPattern = /\d+\.\d+\.x/;

  // If URL contains version pattern like 5.7.x, treat it as legacy
  if (versionPattern.test(url)) {
    return true;
  }

  // Otherwise, compare against the current domain
  return !currentDomain.includes(url);
}


export default ReleaseNotesBreakingChanges;
