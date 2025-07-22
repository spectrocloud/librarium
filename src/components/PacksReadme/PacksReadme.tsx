import React, { useEffect, useState, useMemo, ReactElement } from "react";
import styles from "./PacksReadme.module.scss";
import { ConfigProvider, theme, TreeSelect, Tabs } from "antd";
import CustomLabel from "../Technologies/CategorySelector/CustomLabel";
import PackCardIcon from "../Technologies/PackCardIcon";
import { useHistory } from "react-router-dom";
import "./PacksReadme.antd.css";
import { usePluginData } from "@docusaurus/useGlobalData";
import PacksIntegrationsPluginData from "../Integrations/IntegrationTypes";
import ThemedImage from "@theme/ThemedImage";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { useColorMode } from "@docusaurus/theme-common";
import { packTypeNames, cloudDisplayNames } from "../../constants/packs";
import Admonition from "@theme/Admonition";
import { Redirect } from "react-router-dom";
import useIsBrowser from "@docusaurus/useIsBrowser";
import ReactMarkDown from "react-markdown";
import remarkGfm from "remark-gfm";
interface PackReadmeProps {
  customDescription: string;
  packUidMap: Record<string, { deprecated?: boolean; readme?: ReactElement; registryUid?: string }>;
  versions: Version[];
  title: string;
  logoUrl: string;
  type: string;
  provider: Array<string>;
  registries: Array<string>;
  selectedRepositories: Array<{ uid: string; name: string }>;
  disabled: boolean;
  latestVersion: string;
}

interface MarkdownFile {
  default: React.FC;
}

interface Version {
  title: string;
  children: Array<{
    title: string;
    packUid: string;
  }>;
}

interface PackData {
  customDescription: string;
  packUidMap: Record<string, { deprecated?: boolean; readme?: string; registryUid?: string }>;
  versions: Version[];
  title: string;
  logoUrl: string;
  type: string;
  provider: Array<string>;
  registries: Array<string>;
  selectedRepositories: Array<{ uid: string; name: string }>;
  disabled: boolean;
  latestVersion: string;
}

// Moved function declarations to the root level
function versionChange(
  item: string,
  setSelectedVersion: React.Dispatch<React.SetStateAction<string>>,
  setSelectedPackUid: React.Dispatch<React.SetStateAction<string>>,
  getParentVersion: (version: string) => Version | undefined,
  history: ReturnType<typeof useHistory>,
  packName: string,
  selectedTabPane: string = "main"
) {
  const [version, packUid] = item.split("===");
  const parentVersion = getParentVersion(version)?.title || "";
  history.replace({ search: `?pack=${packName}&version=${version}&parent=${parentVersion}&tab=${selectedTabPane}` });
  setSelectedVersion(version);
  setSelectedPackUid(packUid);
}

function getParentVersion(version: string, packData: PackData) {
  return packData.versions.find((tagVersion) => tagVersion.children.find((child) => child.title === version));
}

function compareVersions(v1: string, v2: string): number {
  const v1Parts = v1.split(".").map(Number);
  const v2Parts = v2.split(".").map(Number);

  for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
    const v1Part = v1Parts[i] || 0;
    const v2Part = v2Parts[i] || 0;

    if (v1Part < v2Part) {
      return 1;
    }
    if (v1Part > v2Part) {
      return -1;
    }
  }

  return 0;
}

function sortChildren(tagVersion: Version) {
  const children = tagVersion.children || [];
  return children
    .sort((a, b) => compareVersions(a.title, b.title))
    .map((child) => ({
      value: `${child.title}===${child.packUid}`,
      title: <span>{child.title}</span>,
    }));
}

function renderVersionOptions(packData: PackData) {
  // If there are no versions, we exit immediately
  const versions = packData.versions;
  if (versions === undefined) {
    return;
  }
  return versions
    .sort((a, b) => compareVersions(a.title, b.title))
    .map((tagVersion) => ({
      value: tagVersion.title,
      title: tagVersion.title,
      selectable: false,
      children: sortChildren(tagVersion),
    }));
}

function getProviders(packData: PackData) {
  if (packData.provider.includes("all")) {
    return "All";
  }
  return packData.provider
    .map((provider) => cloudDisplayNames[provider as keyof typeof cloudDisplayNames] || provider)
    .join(", ");
}

function generateNewHeadingId(props: { node: { children: { value: string }[] } }) {
  const heading = (props?.node?.children?.[0] as { value: string })?.value;
  const headingId = heading?.replace(/\s+/g, "-").toLowerCase();
  return { id: headingId, title: heading };
}

function processPackUiMap(
  packUidMap: Record<string, { readme?: string }>
): Record<string, { deprecated?: boolean; readme?: ReactElement; registryUid?: string }> {
  const newPackUidMap: Record<string, { deprecated?: boolean; readme?: ReactElement; registryUid?: string }> = {};
  Object.entries(packUidMap).map(([key, value]) => {
    if (key) {
      const readmeFileName = packUidMap[key].readme;
      let module;
      if (readmeFileName) {
        module = (
          <ReactMarkDown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: (props) => {
                const { id, title } = generateNewHeadingId(props);
                return (
                  <h1 id={id}>
                    {title}
                    <a href={`#${id}`} className="hash-link" />
                  </h1>
                );
              },
              h2: (props) => {
                const { id, title } = generateNewHeadingId(props);
                return (
                  <h2 id={id}>
                    {title}
                    <a href={`#${id}`} className="hash-link" />
                  </h2>
                );
              },
              h3: (props) => {
                const { id, title } = generateNewHeadingId(props);
                return (
                  <h3 id={id}>
                    {title}
                    <a href={`#${id}`} className="hash-link" />
                  </h3>
                );
              },
            }}
          >
            {readmeFileName}
          </ReactMarkDown>
        );
      }
      newPackUidMap[key] = {
        ...value,
        readme: module ? (module as ReactElement) : undefined,
      };
    }
  });
  return newPackUidMap;
}

function getRegistries(packData: PackData, selectedVersion: string, selectedPackUid: string) {
  if (selectedVersion && !selectedVersion.endsWith(".x")) {
    const registryUid = packData.packUidMap[selectedPackUid]?.registryUid || "";
    const registry = packData.selectedRepositories.find((registry) => registry.uid === registryUid);
    return registry ? registry.name : "";
  }
  const consolidatedRegistries = packData.registries.reduce<string[]>((accumulator, registry) => {
    const regObj = packData.selectedRepositories.find((repo) => repo.uid === registry);
    if (regObj) {
      accumulator.push(regObj.name);
    }
    return accumulator;
  }, []);
  return consolidatedRegistries.join(", ");
}

export default function PacksReadme() {
  try {
    const { packs, repositories } = usePluginData("plugin-packs-integrations") as PacksIntegrationsPluginData;
    const [fragmentIdentifier, setFragmentIdentifier] = useState<string>("");
    const [customReadme, setCustomReadme] = useState<ReactElement<any, any> | null>(null);
    const [packName, setPackName] = useState<string>("");
    const [selectedPackUid, setSelectedPackUid] = useState<string>("");
    const { colorMode } = useColorMode();
    const { defaultAlgorithm, darkAlgorithm } = theme;
    const [selectedTabPane, setSelectedTabPane] = useState<string>("");
    const [selectedVersion, setSelectedVersion] = useState<string>("");
    const history = useHistory();
    const isBrowser = useIsBrowser();

    useEffect(() => {
      let pckName = "";
      if (isBrowser) {
        const searchParams = window ? new URLSearchParams(window.location.search) : null;
        const hashLocationValue = window ? window.location.hash : "";
        pckName = searchParams?.get("pack") || "";
        setPackName(pckName);
        if (hashLocationValue) {
          setFragmentIdentifier(hashLocationValue);
        }
      }
      const importComponent = async () => {
        try {
          const module: MarkdownFile = await import(`../../../docs/docs-content/integrations/${pckName}.mdx`);
          const PackReadMeComponent = module.default;
          setCustomReadme(
            <div className={styles.customReadme}>
              <PackReadMeComponent />
            </div>
          );
        } catch (error) {
          console.error("Error importing custom readme component for pack. Additional information follows: \n", error);
          setCustomReadme(null);
        }
      };
      importComponent().catch((e) => {
        console.error("Error importing custom readme component for pack. Additional information follows: \n", e);
      });
    }, []);

    const packData: PackData = useMemo(() => {
      const pack = packs.find((pack) => pack.name === packName);
      if (pack) {
        const packDataInfo: PackReadmeProps = {
          customDescription: pack.description,
          packUidMap: processPackUiMap(pack.packUidMap),
          versions: pack.versions,
          title: pack.title,
          logoUrl: pack.logoUrl,
          type: pack.packType,
          provider: pack.cloudTypes,
          registries: pack.registries,
          selectedRepositories: repositories,
          disabled: pack.disabled,
          latestVersion: pack.latestVersion,
        };
        return packDataInfo;
      }
      return {
        customDescription: "",
        packUidMap: {},
        versions: [],
        title: "",
        logoUrl: "",
        type: "",
        provider: [],
        selectedRepositories: [],
        registries: [],
        disabled: false,
        latestVersion: "",
      };
    }, [packName]);

    useEffect(() => {
      if (isBrowser && fragmentIdentifier) {
        const timeoutId = setTimeout(() => {
          const elementId = fragmentIdentifier.replace("#", "");
          const parent = document.getElementById?.(elementId);
          parent?.querySelector?.("a")?.click();
        }, 1000);
        return () => clearTimeout(timeoutId);
      }
    }, [fragmentIdentifier]);

    useEffect(() => {
      let searchParams;
      if (isBrowser) {
        searchParams = new URLSearchParams(window.location.search);
      }
      const urlParamVersion = searchParams?.get("version");
      const urlParamTag = searchParams?.get("tab");
      setSelectedTabPane(urlParamTag || "main");
      const version = urlParamVersion || packData?.latestVersion || packData?.versions[0]?.title || "";
      if (version && !version.endsWith(".x")) {
        const parentVersionObj = getParentVersion(version, packData);
        const packDataObj = parentVersionObj?.children.find((child) => child.title === version);
        if (packDataObj) {
          setSelectedPackUid(packDataObj.packUid);
          setSelectedVersion(version);
        }
      }
    }, [packData]);

    const renderTabs = () => {
      const empty_icon_light = useBaseUrl("/img/empty_icon_table_light.svg");
      const empty_icon_dark = useBaseUrl("/img/empty_icon_table_dark.svg");
      const ReadMe = selectedPackUid ? packData.packUidMap[selectedPackUid]?.readme : null;

      const tabs = [
        ReadMe && {
          label: `README`,
          key: "main",
          children: ReadMe,
        },
        customReadme && {
          label: `Additional Details`,
          key: "custom",
          children: customReadme,
        },
      ].filter(Boolean) as { label: string; key: string; children: JSX.Element }[];
      if (tabs.length > 1) {
        return (
          <div>
            <Tabs
              defaultActiveKey={selectedTabPane || "main"}
              items={tabs}
              onChange={(key) => {
                setSelectedTabPane(key);
                const parentVersion = getParentVersion(selectedVersion, packData)?.title || "";
                history.replace({
                  search: `?pack=${packName}&version=${selectedVersion}&parent=${parentVersion}&tab=${key}`,
                });
              }}
            />
          </div>
        );
      }
      if (tabs.length === 1) {
        return tabs[0].children;
      }
      return (
        <div className={styles.emptyContent}>
          <ThemedImage
            alt="Docusaurus themed image"
            sources={{
              light: empty_icon_light,
              dark: empty_icon_dark,
            }}
            width={120}
            height={120}
          />
          <div className={styles.emptyContentTitle}>No README found</div>
        </div>
      );
    };

    return (
      <div className={styles.wrapper}>
        <div className={styles.description}>
          <div className={styles.packDescFirstCol}>
            <div className={styles.packName}>{packData.title}</div>
            <div className={styles.descriptionContent}>
              <PackCardIcon className={styles.packIcon} logoUrl={packData.logoUrl} type={packData.type} />
              <div className={styles.customDesc}>{packData.customDescription}</div>
            </div>
          </div>
          <div className={styles.packDescSecondCol}>
            <div className={styles.versionSelect}>
              <CustomLabel label="Version" />
              <TreeSelect
                className={styles.versionSelectBox}
                showSearch
                value={selectedVersion}
                styles={{ popup: { maxHeight: 400, overflow: "auto" } }}
                placeholder="Search"
                treeDefaultExpandAll
                onChange={(item) =>
                  versionChange(
                    item,
                    setSelectedVersion,
                    setSelectedPackUid,
                    (version) => getParentVersion(version, packData),
                    history,
                    packName,
                    selectedTabPane
                  )
                }
                treeData={renderVersionOptions(packData)}
              />
            </div>
            <div className={styles.packDesc}>
              <div className={styles.packDescItem}>{`Type: ${packTypeNames[packData.type]}`}</div>
              <div className={styles.packDescItem}>{`Cloud Providers: ${getProviders(packData)}`}</div>
              <div
                className={styles.packDescItem}
              >{`Registry: ${getRegistries(packData, selectedVersion, selectedPackUid)}`}</div>
            </div>
          </div>
        </div>
        <div className={styles.warningSection}>
          {packData.disabled ? (
            <Admonition type="warning" icon="⚠️" title="Warning">
              Pack version <strong>v{selectedVersion}</strong> is disabled. Upgrade to a newer version to take advantage
              of new features.
            </Admonition>
          ) : selectedPackUid && packData.packUidMap[selectedPackUid]?.deprecated ? (
            <Admonition type="warning" icon="⚠️" title="Warning">
              Pack version <strong>v{selectedVersion}</strong> is deprecated. Upgrade to a newer version to take
              advantage of new features.
            </Admonition>
          ) : null}
        </div>
        <div className={styles.tabPane}>
          <ConfigProvider theme={{ algorithm: colorMode === "dark" ? darkAlgorithm : defaultAlgorithm }}>
            {renderTabs()}
          </ConfigProvider>
        </div>
      </div>
    );
  } catch (e) {
    console.error(
      "Error fetching packs data. Additional information follows: \n",
      e,
      "\nRedirecting to integrations page."
    );
    return <Redirect to="/integrations" />;
  }
}
