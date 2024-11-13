import React, { useEffect, useState, useMemo, ReactElement } from "react";
import styles from "./PacksReadme.module.scss";
import { Tabs, ConfigProvider, theme, TreeSelect } from "antd";
import CustomLabel from "../Technologies/CategorySelector/CustomLabel";
import PackCardIcon from "../Technologies/PackCardIcon";
import Markdown from "markdown-to-jsx";
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

interface PackReadmeProps {
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
  packName: string
) {
  const [version, packUid] = item.split("===");
  const parentVersion = getParentVersion(version)?.title || "";
  history.replace({ search: `?pack=${packName}&version=${version}&parent=${parentVersion}` });
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

function renderVersionOptions(packData: PackData) {
  return packData.versions
    .sort((a, b) => compareVersions(a.title, b.title))
    .map((tagVersion) => ({
      value: tagVersion.title,
      title: tagVersion.title,
      selectable: false,
      children: tagVersion.children
        .sort((a, b) => compareVersions(a.title, b.title))
        .map((child) => ({
          value: `${child.title}===${child.packUid}`,
          title: <span>{child.title}</span>,
        })),
    }));
}

function renderTabs(selectedPackUid: string, packData: PackData, customReadme: ReactElement<any, any> | null, fragmentIdentifier: string) {
  const empty_icon_light = useBaseUrl("/img/empty_icon_table_light.svg");
  const empty_icon_dark = useBaseUrl("/img/empty_icon_table_dark.svg");
  const readme = selectedPackUid ? packData.packUidMap[selectedPackUid]?.readme : "";
  const tabs = [
    readme && {
      label: `README`,
      key: "1",
      children: <Markdown>{readme}</Markdown>,
    },
    customReadme && {
      label: `Additional Details`,
      key: "2",
      children: customReadme,
    },
  ].filter(Boolean) as { label: string; key: string; children: JSX.Element }[];

  if (tabs.length > 1) {
    return (
      <Tabs defaultActiveKey={fragmentIdentifier ? "2" : "1"}>
        {tabs.map((item) => (
          <Tabs.TabPane tab={item.label} key={item.key}>
            {item.children}
          </Tabs.TabPane>
        ))}
      </Tabs>
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
}

function getProviders(packData: PackData) {
  if (packData.provider.includes("all")) {
    return "All";
  }

  return packData.provider
    .map((provider) => cloudDisplayNames[provider as keyof typeof cloudDisplayNames] || provider)
    .join(", ");
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
    const [selectedVersion, setSelectedVersion] = useState<string>("");
    const history = useHistory();

    useEffect(() => {
      const searchParams = window ? new URLSearchParams(window.location.search) : null;
      const hashLocationValue = window ? window.location.hash : "";
      const pckName = searchParams?.get("pack") || "";
      setPackName(pckName);
      const importComponent = async () => {
        try {
          const module: MarkdownFile = await import(`../../../docs/docs-content/integrations/${pckName}.md`);
          const PackReadMeComponent = module.default;
          setCustomReadme(
            <div className={styles.customReadme}>
              <PackReadMeComponent />
            </div>
          );
          if (hashLocationValue) {
            setFragmentIdentifier(hashLocationValue);
          }
        } catch (error) {
          console.error("Error importing custom readme component for pack. Additional information follows: \n", error);
          setCustomReadme(null);
        }
      };
      importComponent().catch((e) => {
        console.error("Error importing custom readme component for pack. Additional information follows: \n", e);
      });
    }, []);

    useEffect(() => {
      if (document && fragmentIdentifier) {
        const elementId = fragmentIdentifier.replace("#", "");
        const parent = document.getElementById?.(elementId);
        parent?.querySelector?.("a")?.click();
      }
    }, [fragmentIdentifier]);

    const packData: PackData = useMemo(() => {
      const pack = packs.find((pack) => pack.name === packName);
      if (pack) {
        const packDataInfo: PackReadmeProps = {
          customDescription: pack.description,
          packUidMap: pack.packUidMap,
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
      const searchParams = window ? new URLSearchParams(window.location.search) : null;
      const urlParamVersion = searchParams?.get("version");
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
                dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                placeholder="Search"
                treeDefaultExpandAll
                onChange={(item) =>
                  versionChange(
                    item,
                    setSelectedVersion,
                    setSelectedPackUid,
                    (version) => getParentVersion(version, packData),
                    history,
                    packName
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
            {renderTabs(selectedPackUid, packData, customReadme, fragmentIdentifier)}
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
