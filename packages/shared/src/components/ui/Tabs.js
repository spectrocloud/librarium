import React from "react";
import { Tabs as AntTabs } from "antd";
import styled from "styled-components";
import {useURLQuery} from "../../utils/location"
//

const StyledTabs = styled(AntTabs)`
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

export default function Tabs({identifier, ...rest}) {
  const query = useURLQuery();
  let defaultTab;

  if (query[identifier]) {
    defaultTab = query[identifier];
  }

  function renderIdentifier() {
    if (identifier) {
      return <div id={identifier} />
    }

    return null;
  }

  return <>
    {renderIdentifier()}
    <StyledTabs {...rest} defaultActiveKey={defaultTab} />
  </>
};

Tabs.TabPane = AntTabs.TabPane;
