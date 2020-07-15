import styled from "styled-components";
import { Tabs } from "antd";

const StyledTabs = styled(Tabs)`
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

export default StyledTabs;
