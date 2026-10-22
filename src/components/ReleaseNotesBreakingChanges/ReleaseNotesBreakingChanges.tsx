import React, { useEffect, useState, FunctionComponent, useMemo } from "react";
import styles from "./ReleaseNotesBreakingChanges.module.scss";
import Versions from "./versions.json";
import Select, { components, OptionProps, StylesConfig } from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import useIsBrowser from "@docusaurus/useIsBrowser";
import Admonition from "@theme/Admonition";
import Link from "@docusaurus/Link";
import PartialsComponent from "../PartialsComponent";
import * as partialsExports from "@site/_partials";
import { compareVersions, isGreaterVersion, isVersionInRange } from "./VersionUtils";

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

type CustomOptionProps = OptionProps<VersionOption, false>;

const partials: Modules = partialsExports as unknown as Modules;

const CustomOption: React.FC<CustomOptionProps> = (props) => {
  const {
    data: { label },
  } = props;

  // Return the Option component with proper props spread and conditional rendering
  return <components.Option {...props}>{label}</components.Option>;
};

function getVersionsFromFile(): string[] {
  const versions: string[] = Versions;
  versions.sort((a, b) => compareVersions(a, b, "DESC"));
  return versions;
}

function getBreakingChangesBetweenVersions(from: string, to: string): string[] {
  const breakingVersionsList: string[] = [];
  const partialKeys: string[] = Object.keys(partials);
  partialKeys.map(function (key) {
    const currentPartial: Module = partials[key];
    const catFrontMatter = currentPartial.frontMatter.partial_category;
    const nameFrontMatter = currentPartial.frontMatter.partial_name.toString();
    if (catFrontMatter == "breaking-changes") {
      if (nameFrontMatter.includes("component-updates-")) {
        const range = nameFrontMatter.split("-RANGE-")[1] ?? ""; // "4.7.20-4.7.23"
        const [rangeFrom, rangeTo] = range.split("-");
        if (isVersionInRange(rangeFrom, from, to) || isVersionInRange(rangeTo, from, to)) {
          breakingVersionsList.push(nameFrontMatter);
        }
      } else if (isVersionInRange(nameFrontMatter, from, to)) {
        breakingVersionsList.push(nameFrontMatter);
      }
    }
  });

  breakingVersionsList.sort((a, b) => compareVersions(a, b, "ASC"));
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
    ...versionsList.map((version) => ({
      label: version,
      value: version,
    })),
  ];

  const toVersionOptions = useMemo(() => {
    if (!selectedFromVersion) return versions;

    return versions.filter((v) => isGreaterVersion(v.value, selectedFromVersion.value));
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

  const customSelectStyles: StylesConfig<VersionOption, false> = {
    control: (provided, state) => ({
      ...provided,
      background: "var(--custom-release-notes-background-color)",
      color: "var(--custom-release-notes-background-font-color)",
      boxShadow: "none",
      cursor: state.isDisabled ? "not-allowed" : "default",
      opacity: state.isDisabled ? 0.6 : 1,
    }),
    container: (provided, state) => ({
      ...provided,
      cursor: state.isDisabled ? "not-allowed" : "default",
    }),
    valueContainer: (provided, state) => ({
      ...provided,
      cursor: state.isDisabled ? "not-allowed" : "default",
    }),
    menu: (provided) => ({
      ...provided,
      marginTop: "0",
      backgroundColor: "var(--custom-release-notes-menu-padding)",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "var(--custom-release-notes-background-font-color)",
    }),
    option: (provided, state) => ({
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

  const legacy = isLegacy(externalDomainURL, useIsBrowser());
  if (legacy) {
    return (
      <Admonition type="tip">
        To find breaking changes between releases, check out the latest
        <Link href="https://docs.spectrocloud.com/release-notes/breaking-changes"> Find Breaking Changes</Link> page.
      </Admonition>
    );
  }

  return (
    <div>
      <div className={styles.breakingChangesContainer}>
        <p>
          Use the version selector below to find all the breaking changes between two releases. <br /> Start by
          selecting the current version you have installed.
        </p>
        <div className={styles.dropdownContainer}>
          <div className={styles.dropdownGroupFirst}>
            <label className={styles.dropdownLabel} htmlFor="version-select-1">
              Current Version:
            </label>
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
            <label className={styles.dropdownLabel} htmlFor="version-select-2">
              {" "}
              Target Version:
            </label>
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
            Breaking Changes from <strong>{selectedFromVersion.label}</strong> to{" "}
            <strong>{selectedToVersion.label}</strong>
          </h3>
          <br />
          {breakingVersionsList.length === 0 ? (
            <div>No breaking changes found.</div>
          ) : (
            breakingVersionsList.map((version) => (
              <div key={version}>
                <div className={styles.breakingChangeTitle}>
                  {version.includes("component-updates-")
                    ? `${(version.split("TITLE-{")[1]?.split("}")[0] ?? "").trim()} - Component Updates`.trim()
                    : version}
                </div>
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
  return currentDomain.includes(url);
}

export default ReleaseNotesBreakingChanges;
