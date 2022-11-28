import React, { useContext, createContext, useRef } from "react";
import { Tabs as AntTabs } from "antd";
import styled from "styled-components";
import { useURLQuery } from "../../utils/location";
import { useLocation } from "@reach/router";

const StyledTabs = styled(AntTabs)`
  &.ant-tabs {
    padding-left: 26px;
    margin-left: -26px;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    color: #9698a9;
  }

  .ant-tabs-tab:hover {
    color: inherit;
  }

  .ant-tabs-tab-btn {
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    color: #9698a9;
  }
  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #206cd1;
    :hover {
      color: #206cd1;
    }
  }
`;

const TabsContext = createContext();

export const useTabsContext = () => useContext(TabsContext);

export default function Tabs({ identifier, ...rest }) {
  const query = useURLQuery();
  const clickedOnHash = useRef(null);
  const [activeKey, setActiveKey] = React.useState(rest?.children?.[0]?.key || "");
  const location = useLocation();

  React.useEffect(() => {
    if (query[identifier]) {
      setActiveKey(query[identifier]);
      clickedOnHash.current = false;
    }
  }, [identifier, query]);

  React.useEffect(() => {
    if (location.hash && clickedOnHash.current === false) {
      const anchor = document.createElement("a");
      anchor.href = location.hash;
      anchor.click();
      clickedOnHash.current = true;
    }
  }, [activeKey, location]);

  function renderIdentifier() {
    if (identifier) {
      return <div id={identifier} />;
    }

    return null;
  }

  return (
    <TabsContext.Provider value={{ id: identifier, activeKey }}>
      {renderIdentifier()}
      <StyledTabs
        {...rest}
        type={"card"}
        activeKey={activeKey}
        onChange={setActiveKey}
        destroyInactiveTabPane={true}
      />
    </TabsContext.Provider>
  );
}

Tabs.TabPane = AntTabs.TabPane;
