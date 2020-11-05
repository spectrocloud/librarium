import React, { useContext, createContext, useRef } from "react";
import { Tabs as AntTabs } from "antd";
import styled from "styled-components";
import { useURLQuery } from "../../utils/location"
import { useLocation } from "@reach/router";
//

const StyledTabs = styled(AntTabs)`
  &.ant-tabs {
    padding-left: 26px;
    margin-left: -26px;
  }

  .ant-tabs-tab.ant-tabs-tab-active {
    color: #4432F5;

    :hover {
      color: #4432F5;
    }
  }

  .ant-tabs-tab:hover {
    color: inherit;
  }

  .ant-tabs-ink-bar {
    background: #4432F5;
  }
`;

const TabsContext = createContext();

export const useTabsContext = () => useContext(TabsContext);

export default function Tabs({ identifier, ...rest }) {
  const query = useURLQuery();
  const clickedOnHash = useRef(null);
  const [activeKey, setActiveKey] = React.useState(rest?.children?.[0]?.key || "");

  React.useEffect(() => {
    if (query[identifier]) {
      setActiveKey(query[identifier])
      clickedOnHash.current = false;
    }
  }, [location.hash]);

  React.useEffect(() => {
    if (location.hash && clickedOnHash.current === false) {
      const anchor = document.createElement("a");
      anchor.href = location.hash;
      anchor.click();
      clickedOnHash.current = true;
    }
  }, [location.hash]);

  function renderIdentifier() {
    if (identifier) {
      return <div id={identifier} />
    }

    return null;
  }

  return (
    <TabsContext.Provider value={{id: identifier, activeKey}}>
      {renderIdentifier()}
      <StyledTabs {...rest} activeKey={activeKey} onChange={setActiveKey} destroyInactiveTabPane={true} />
    </TabsContext.Provider>
  )
};

Tabs.TabPane = AntTabs.TabPane
