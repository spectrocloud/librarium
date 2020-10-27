import React from "react";
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

export default function Tabs({ identifier, ...rest }) {
  const query = useURLQuery();
  const [activeKey, setActiveKey] = React.useState();
  const location = useLocation();
  React.useEffect(() => {
    let defaultTab;

    if (query[identifier]) {
      defaultTab = query[identifier];
    }
    setActiveKey(defaultTab)

    if (location.hash) {
      const anchor = document.createElement("a")
      anchor.href = location.hash;
      anchor.click();
    }
  }, [])

  function renderIdentifier() {
    if (identifier) {
      return <div id={identifier} />
    }

    return null;
  }

  return <>
    {renderIdentifier()}
    <StyledTabs {...rest} activeKey={activeKey} onChange={setActiveKey} destroyInactiveTabPane={true} />
  </>
};

Tabs.TabPane = AntTabs.TabPane
