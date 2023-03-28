import React, { useMemo, useState } from "react";
import { Select } from "antd";
import styled from "styled-components";
import ApiSidebarTree from "../../layouts/Api/apiSideBarTree";

const Wrap = styled.div`
  &:focus {
    outline: none;
  }

  .ant-select-single:not(.ant-select-customize-input) .ant-select-selector {
    background-color: transparent;
    border: 0;
    border-bottom: 1px solid #d9d9d9;
    &:focus-visible {
      outline: none;
    }
  }
`;

const StyledSelect = styled(Select)`
  width: 100%;
`;

const SelectWrap = styled.div`
  padding: 0 20px;
`;

const getVersions = (edges) => {
  const versions = edges.reduce(
    (
      accumulator,
      {
        node: {
          fields: { version, api },
        },
      }
    ) => {
      if (api) {
        accumulator.add(version);
      }

      return accumulator;
    },
    new Set()
  );

  return [...versions].sort().reverse();
};

export default function ApiSidebar({ allMdx, ...rest }) {
  const versions = useMemo(() => {
    return getVersions(allMdx.edges);
  }, [allMdx.edges]);

  const [selectedVersion, updateSelectedVersion] = useState(versions[0]);

  return (
    <Wrap>
      <SelectWrap>
        <StyledSelect value={selectedVersion} onChange={updateSelectedVersion}>
          {versions.map((version, index) => (
            <Select.Option key={index} value={version}>
              {version}
            </Select.Option>
          ))}
        </StyledSelect>
      </SelectWrap>
      <ApiSidebarTree {...rest} />
    </Wrap>
  );
}
