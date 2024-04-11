import React, { useEffect, useState, useMemo, lazy, Suspense, ReactElement } from "react";
import { useLocation } from 'react-router-dom';
import { IntegrationsData, PacksData } from "../Integrations/IntegrationTypes";
import styles from "./PacksReadme.module.scss";
import { Select, List, Tabs } from "antd";
import CustomLabel from "../Technologies/CategorySelector/CustomLabel";
import PackCardIcon from "../Technologies/PackCardIcon";
import { Typography } from "antd";
import Markdown from 'markdown-to-jsx';
import "./PacksReadme.antd.css";
import { usePluginData } from "@docusaurus/useGlobalData";
import PacksIntegrationsPluginData from "../Integrations/IntegrationTypes";


interface TechnologiesProps {
  data: PacksData | IntegrationsData;
}

export default function PacksReadme() {
  const { Text } = Typography;
  //const location = useLocation();
  //const packName = location?.state?.id || "";
  const [selectedVersion, setSelectedVersion] = useState<string>("");
  //const [md, setMd] = useState(null);
  //let Custom = falco;

  //const [md, setMd] = useState<ReactElement<any, any> | null>(null);

  const [md, setMd] = useState<ReactElement<any, any> | null>(null);
  const packName = new URLSearchParams(window.location.search).get("pack")


  useEffect(() => {
    const importComponent = async () => {
      try {
        console.log("packName", packName);
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
    if(_packData) {
      setSelectedVersion(_packData.fields.versions[0].title);
      return {
        customDescription: _packData.fields.description,
        packReadme: _packData.fields.readme,
        versions: _packData.fields.versions,
        title: _packData.fields.title,
        logoUrl: _packData.fields.logoUrl,
        type: _packData.fields.packType,
      };
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

  function versionSupportedTextRender() {
    if(selectedVersion) {
      const listVersion = packData.versions?.find((ver) => ver.title === selectedVersion);
      if(listVersion) {
        return (
          <>
            <List
              size="small"
              header={<div>Versions Supported</div>}
              dataSource={listVersion.children}
              renderItem={child => <List.Item><div className={styles.bullets}>{child.title}</div></List.Item>}
            />

          </>
        )
      }
    }
    return null;
  }

  function changeReadMeTab() {

  }

  function renderTabs() {
    let readme = "";
    if (Object.keys(packData.packReadme).length && md) {
      const packUid = packData.versions.find((ver) => ver.title === selectedVersion)?.packUid;
      readme = packUid ? packData.packReadme[packUid] : "";
      const items = [
        {
          label: `Pack details`,
          key: '1',
          children: (<Markdown children={readme} />),
        },
        {
          label: `Additional details`,
          key: '2',
          children: md,
        },
      ]
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
      )
    } else if(Object.keys(packData.packReadme).length) {
      const packUid = packData.versions.find((ver) => ver.title === selectedVersion)?.packUid;
      readme = packUid ? packData.packReadme[packUid] : "";
      return (<Markdown children={readme} />)
    } else if(md) {
      return md;
    } else {
      return null;
    }

  }
  return (
    <div className={styles.wrapper}>
      <div className={styles.description}>
        <div className={styles.packdescfirstrow}>
          <div className={styles.packname}>{packName}</div>
          <div className={styles.versionselect}>
            <CustomLabel label="Version" />
            <Select
              allowClear
              placeholder="Search"
              onChange={(item) => versionChange(item as string)} // Cast item to string[]
              value={selectedVersion}
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
      <div className={styles.versionsection}>
        {versionSupportedTextRender()}
      </div>
      <div>
        {renderTabs()}
      </div>
    </div>
  );
}
