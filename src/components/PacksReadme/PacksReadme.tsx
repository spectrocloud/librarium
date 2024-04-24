import React, { useEffect, useState, useMemo, ReactElement } from "react";
import styles from "./PacksReadme.module.scss";
import { Select, Tabs, ConfigProvider, theme, Space } from "antd";
import CustomLabel from "../Technologies/CategorySelector/CustomLabel";
import PackCardIcon from "../Technologies/PackCardIcon";
import Markdown from 'markdown-to-jsx';
import "./PacksReadme.antd.css";
import { usePluginData } from "@docusaurus/useGlobalData";
import PacksIntegrationsPluginData from "../Integrations/IntegrationTypes";
import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from "@docusaurus/useBaseUrl"
import { useColorMode } from "@docusaurus/theme-common";
import { packTypeNames, cloudDisplayNames } from "../Technologies/PackConstants";

interface PackReadmeProps {
  customDescription: string,
  packReadme: any,
  versions: Array<any>,
  title: string,
  logoUrl: string,
  type: string,
  provider: Array<string>,
  registries: Array<string>,
  selectedRepositories: Array<any>,
}

export default function PacksReadme() {
  const [selectedVersion, setSelectedVersion] = useState<string>("");
  const [md, setMd] = useState<ReactElement<any, any> | null>(null);
  const empty_icon_light = useBaseUrl('/img/empty_icon_table_light.svg');
  const empty_icon_dark = useBaseUrl('/img/empty_icon_table_dark.svg');
  const { isDarkTheme } = useColorMode();
  const { defaultAlgorithm, darkAlgorithm } = theme;
  const packName = new URLSearchParams(window.location.search).get("pack")
  useEffect(() => {
    const importComponent = async () => {
      try {
        const module = await import(`../../../docs/docs-content/integrations/${packName}.md`);
        const PackReadMeComponent = module.default;
        setMd(<PackReadMeComponent />);
      }
      catch (error) {
        setMd(null);
      }
    };
    importComponent();
  }, []);

  const packData = useMemo(() => {
    const { packs, repositories } = usePluginData("plugin-packs-integrations") as PacksIntegrationsPluginData;
    const _packData = packs.filter((pack) => pack.fields.name === packName)[0];
    if (_packData) {
      setSelectedVersion(`${_packData.fields.versions[0].title}`);
      const packDataInfo: PackReadmeProps = {
        customDescription: _packData.fields.description,
        packReadme: _packData.fields.readme,
        versions: _packData.fields.versions,
        title: _packData.fields.title,
        logoUrl: _packData.fields.logoUrl,
        type: _packData.fields.packType,
        provider: _packData.fields.cloudTypes,
        registries: _packData.fields.registries,
        selectedRepositories: repositories,
      };
      return packDataInfo;
    }
    return {
      customDescription: "",
      packReadme: {},
      versions: [],
      title: "",
      logoUrl: "",
      type: "",
      provider: [],
      selectedRepositories: [],
      registries: [],
    };
  }, [packName]);

  function versionChange(version: string) {
    setSelectedVersion(version);
  }

  function renderVersionOptions() {
    return packData.versions.map((_version) => {
      return (<Select.Option key={_version.title}>
        {_version.title}
      </Select.Option>)
    });
  }

  function renderTabs() {
    const packUid = packData.versions.find((ver) => ver.title === selectedVersion)?.packUid;
    let readme = packUid ? packData.packReadme[packUid] : "";
    if (readme && md) {
      const items = [
        {
          label: `Readme`,
          key: '1',
          children: (<Markdown children={readme} />),
        },
        {
          label: `Additional details`,
          key: '2',
          children: md,
        },
      ] as { label: string, key: string, children: JSX.Element }[];

      return (
        <Tabs defaultActiveKey="1">
          {items.map((item) => {
            return (
              <Tabs.TabPane tab={item.label} key={item.key}>
                {item.children}
              </Tabs.TabPane>
            )
          })}
        </Tabs>
      );
    }
    return (
      <>
        {readme ? (<Markdown children={readme} />)
          : md ? md
            : (<div className={styles.emptyContent}>
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
            </div>)}
      </>
    );
  }

  function getProviders() {
    if (packData.provider.includes("all")) {
      return "All";
    } else {
      return packData.provider.map((_provider) => cloudDisplayNames[_provider as keyof typeof cloudDisplayNames] || _provider).join(", ");
    }
  }
  function getRegistries() {
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
      <ConfigProvider theme={{
        algorithm: isDarkTheme ? darkAlgorithm : defaultAlgorithm,
      }}>
        <div className={styles.description}>
          <div className={styles.packdescfirstcol}>
            <div className={styles.packname}>{packData.title}</div>
            <div className={styles.descriptioncontent}>
              <PackCardIcon className={styles.packicon} title={packData.title} logoUrl={packData.logoUrl} type={packData.type} />
              <div className={styles.customdesc}>{packData.customDescription}</div>
            </div>
          </div>
          <div className={styles.packdescsecondcol}>
            <div className={styles.versionselect}>
              <CustomLabel label="Version" />
              <Select
                className={styles.versionselectbox}
                allowClear
                placeholder="Search"
                onChange={(item) => versionChange(item as string)}
                value={selectedVersion === packData.versions[0]?.title ? `${selectedVersion} (latest)` : selectedVersion}
              >
                {renderVersionOptions()}
              </Select>
            </div>
            <div className={styles.packdesc}>
              <div className={styles.packdescitem}>
                {`Type: ${packTypeNames[packData.type as keyof typeof packTypeNames]}`}
              </div>
              <div className={styles.packdescitem}>
                {`Cloud Providers: ${getProviders()}`}
              </div>
              <div className={styles.packdescitem}>
                {`Registry: ${getRegistries()}`}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.tabpane}>
          {renderTabs()}
        </div>
      </ConfigProvider>
    </div>
  );
}
