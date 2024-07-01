import React, { useEffect, useState, useMemo, ReactElement } from "react";
import styles from "./PacksReadme.module.scss";
import { Tabs, ConfigProvider, theme, TreeSelect } from "antd";
import CustomLabel from "../Technologies/CategorySelector/CustomLabel";
import PackCardIcon from "../Technologies/PackCardIcon";
import Markdown from 'markdown-to-jsx';
import { useHistory } from "react-router-dom";
import "./PacksReadme.antd.css";
import { usePluginData } from "@docusaurus/useGlobalData";
import PacksIntegrationsPluginData from "../Integrations/IntegrationTypes";
import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from "@docusaurus/useBaseUrl"
import { useColorMode } from "@docusaurus/theme-common";
import { packTypeNames, cloudDisplayNames } from "../../constants/packs";
import { InfoCircleOutlined } from '@ant-design/icons';

interface PackReadmeProps {
  customDescription: string,
  packUidMap: any,
  versions: Array<any>,
  title: string,
  logoUrl: string,
  type: string,
  provider: Array<string>,
  registries: Array<string>,
  selectedRepositories: Array<any>,
  disabled: boolean,
  latestVersion: string,
}

export default function PacksReadme() {
  const { packs, repositories } = usePluginData("plugin-packs-integrations") as PacksIntegrationsPluginData;
  const [customReadme, setCustomReadme] = useState<ReactElement<any, any> | null>(null);
  const [packName, setPackName] = useState<string>("");
  const [selectedPackUid, setSelectedPackUid] = useState<string>("");
  const empty_icon_light = useBaseUrl('/img/empty_icon_table_light.svg');
  const empty_icon_dark = useBaseUrl('/img/empty_icon_table_dark.svg');
  const { colorMode } = useColorMode();
  const { defaultAlgorithm, darkAlgorithm } = theme;
  const [selectedVersion, setSelectedVersion] = useState<string>("");
  const history = useHistory();
  useEffect(() => {
    const searchParams = window ? new URLSearchParams(window.location.search) : null;
    const pckName = searchParams?.get("pack") || "";
    setPackName(pckName);
    const importComponent = async () => {
      try {
        const module = await import(`../../../docs/docs-content/integrations/${pckName}.md`);
        const PackReadMeComponent = module.default;
        setCustomReadme(
          <div className={styles.customReadme}>
            <PackReadMeComponent />
          </div>
        );
      } catch (error) {
        setCustomReadme(null);
      }
    };
    importComponent();
  }, []);

  const packData = useMemo(() => {
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
    let parentVersionObj: any;
    if (version && !version.endsWith(".x")) {
      parentVersionObj = getParentVersion(version);
      const packDataObj = parentVersionObj?.children.find((child: any) => child.title === version);
      setSelectedPackUid(packDataObj?.packUid || "");
    }
    if (!urlParamVersion) {
      let path = `?pack=${packName}&version=${version}`;
      if (parentVersionObj && parentVersionObj.title) {
        path = `${path}&parent=${parentVersionObj.title}`;
      }
      history.replace({ search: path });
    }
    setSelectedVersion(version);
  }, [packData]);
  let infoContent;
  if (packData.disabled) {
    infoContent = "This pack is currently disabled.";
  } else if (selectedPackUid && packData.packUidMap[selectedPackUid]?.deprecated) {
    infoContent = "This pack is deprecated.";
  }

  function versionChange(item: string) {
    const [version, packUid] = item.split("===");
    const parentVersion = getParentVersion(version)?.title || "";
    history.replace({ search: `?pack=${packName}&version=${version}&parent=${parentVersion}` });
    setSelectedVersion(version);
    setSelectedPackUid(packUid);
  }

  function getParentVersion(version: string) {
    return packData.versions.find((tagVersion) => tagVersion.children.find((child: any) => child.title === version));
  }

  function renderVersionOptions() {
    return packData.versions.map((tagVersion) => {
      return ({
        value: tagVersion.title,
        title: tagVersion.title,
        selectable: false,
        children:
          tagVersion.children.map((child: any) => {
            return ({
              value: `${child.title}===${child.packUid}`,
              title: (<span>{child.title}</span>)
            })
          })
      })
    })
  }

  function renderTabs() {
    let readme = selectedPackUid ? packData.packUidMap[selectedPackUid]?.readme : "";
    const tabs = [
      readme && {
        label: `Readme`,
        key: '1',
        children: (<Markdown children={readme} />),
      },
      customReadme && {
        label: `Additional details`,
        key: '2',
        children: customReadme,
      },
    ].filter(Boolean) as { label: string, key: string, children: JSX.Element }[];

    if (tabs.length > 1) {
      return (
        <Tabs defaultActiveKey="1">
          {tabs.map((item) => {
            return (
              <Tabs.TabPane tab={item.label} key={item.key}>
                {item.children}
              </Tabs.TabPane>
            )
          })}
        </Tabs>
      );
    }
    if (tabs.length === 1) {
      return tabs[0].children;
    }
    return (<div className={styles.emptyContent}>
      <ThemedImage
        alt="Docusaurus themed image"
        sources={{
          light: empty_icon_light,
          dark: empty_icon_dark,
        }}
        width={120}
        height={120}
      />
      <div className={styles.emptyContentTitle}>No content available</div>
      <div className={styles.emptyContentDescription}>The content for this pack is not available.</div>
    </div>)
  }

  function getProviders() {
    if (packData.provider.includes("all")) {
      return "All";
    }
    return packData.provider.map((provider) => cloudDisplayNames[provider as keyof typeof cloudDisplayNames] || provider).join(", ");
  }
  function getRegistries() {
    if (selectedVersion && !selectedVersion.endsWith(".x")) {
      const registerUid = packData.packUidMap[selectedPackUid]?.registryUid || "";
      return packData.selectedRepositories.find((registry) => registry.uid === registerUid)?.name || "";
    }
    const consolidatedRegistries = packData.registries.reduce((accumulator: string[], registry) => {
      const regObj = packData.selectedRepositories.find((repo) => repo.uid === registry);
      if (regObj) {
        accumulator.push(regObj.name);
      }
      return accumulator;
    }, []);
    return consolidatedRegistries.join(", ");
  }

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
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="Search"
              treeDefaultExpandAll
              onChange={(item) => versionChange(item as string)}
              treeData={renderVersionOptions()}
            />
          </div>
          <div className={styles.packDesc}>
            <div className={styles.packDescItem}>
              {`Type: ${packTypeNames[packData.type as keyof typeof packTypeNames]}`}
            </div>
            <div className={styles.packDescItem}>
              {`Cloud Providers: ${getProviders()}`}
            </div>
            <div className={styles.packDescItem}>
              {`Registry: ${getRegistries()}`}
            </div>
          </div>
        </div>
      </div>
      {infoContent ? (
        <div className={styles.infoSection}>
          <div className={styles.infoHeading}>
            <InfoCircleOutlined className={styles.infoIcon} />
            {"Info"}
          </div>
          <div className={styles.content}>{infoContent}</div>
        </div>
      ) : null}
      <div className={styles.tabPane}>
        <ConfigProvider theme={{algorithm: colorMode === "dark" ? darkAlgorithm : defaultAlgorithm}}>
          {renderTabs()}
        </ConfigProvider>
      </div>
    </div>
  );
}
