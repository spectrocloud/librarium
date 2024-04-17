import React, { useEffect, useState, useMemo, ReactElement } from "react";
import styles from "./PacksReadme.module.scss";
import { Select, Tabs, ConfigProvider, theme } from "antd";
import CustomLabel from "../Technologies/CategorySelector/CustomLabel";
import PackCardIcon from "../Technologies/PackCardIcon";
import Markdown from 'markdown-to-jsx';
import "./PacksReadme.antd.css";
import { usePluginData } from "@docusaurus/useGlobalData";
import PacksIntegrationsPluginData from "../Integrations/IntegrationTypes";
import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from "@docusaurus/useBaseUrl"
import { useColorMode } from "@docusaurus/theme-common";

interface PackReadmeProps {
  customDescription: string,
  packReadme: any,
  versions: Array<any>,
  title: string,
  logoUrl: string,
  type: string
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
    const { packs } = usePluginData("plugin-packs-integrations") as PacksIntegrationsPluginData;
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
    };
  }, [packName]);

  function versionChange(version: string) {
    setSelectedVersion(version);
  }

  function getOptions() {
    return packData.versions.map((_version) => {
      return (<Select.Option key={_version.title}>
        {_version.title}
      </Select.Option>)
    });
  }

  function renderTabs() {
    let readme = "";
    if (Object.keys(packData.packReadme).length && md) {
      const packUid = packData.versions.find((ver) => ver.title === selectedVersion)?.packUid;
      readme = packUid ? packData.packReadme[packUid] : "";
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
    } else if (Object.keys(packData.packReadme).length) {
      const packUid = packData.versions.find((ver) => ver.title === selectedVersion)?.packUid;
      readme = packUid ? packData.packReadme[packUid as keyof string] : "";
      return (<Markdown children={readme} />);
    } else if (md) {
      return md;
    } else {
      return renderEmptyContent();
    }
  }
  function renderEmptyContent() {
    return (
      <div className={styles.emptyContent}>
        <ThemedImage
          alt="Docusaurus themed image"
          sources={{
            light: empty_icon_light,
            dark: empty_icon_dark,
          }}
        />
          <div className={styles.emptyContentTitle}>No content available</div>
          <div className={styles.emptyContentDescription}>The content for this pack is not available.</div>
      </div>
    );
  }
  return (
    <div className={styles.wrapper}>
      <ConfigProvider theme={{
        algorithm: isDarkTheme ? darkAlgorithm : defaultAlgorithm,
      }}>
        <div className={styles.description}>
          <div className={styles.packdescfirstrow}>
            <div className={styles.packname}>{packName}</div>
            <div className={styles.versionselect}>
              <CustomLabel label="Version" />
              <Select
                allowClear
                placeholder="Search"
                onChange={(item) => versionChange(item as string)}
                value={selectedVersion === packData.versions[0]?.title ? `${selectedVersion} (latest)` : selectedVersion}
              >
                {getOptions()}
              </Select>
            </div>
          </div>
          <div className={styles.packdescription}>
            <PackCardIcon title={packData.title} logoUrl={packData.logoUrl} type={packData.type} />
            <div>{packData.customDescription}</div>
          </div>
        </div>
        <div>
          {renderTabs()}
        </div>
      </ConfigProvider>
    </div>
  );
}
