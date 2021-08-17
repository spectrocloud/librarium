import React, { useMemo, useState } from 'react';
import { SidebarTree } from '@librarium/shared';
import { Select } from 'antd';
import styled from 'styled-components';

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

const getVersions = edges => {
  const versions = edges.reduce((accumulator, { node: { fields: { version, api } } }) => {
    if (api) {
      accumulator.add(version);
    }

    return accumulator;
  }, new Set());

  return [...versions].sort().reverse();
  s;
};

const extractApiMenu = (edges, selectedVersion) => {
  return edges
    .sort((edge1, edge2) => {
      const title1 = edge1.node.fields.title;
      const title2 = edge2.node.fields.title;

      if (title1 < title2) {
        return -1;
      }

      if (title1 > title2) {
        return 1;
      }

      return 0;
    })
    .reduce((accumulator, { node: { fields: { slug, title, icon, version, api } } }) => {
      if (selectedVersion === version && api) {
        accumulator.push({
          url: slug,
          title,
          icon,
        });
      }

      return accumulator;
    }, []);
};

export default function ApiSidebar({ allMdx }) {
  const versions = useMemo(() => {
    return getVersions(allMdx.edges);
  }, [allMdx.edges]);

  const [selectedVersion, updateSelectedVersion] = useState(versions[0]);
  const apiMenu = useMemo(() => {
    return extractApiMenu(allMdx.edges, selectedVersion);
  }, [allMdx.edges, selectedVersion]);

  return (
    <Wrap>
      <SelectWrap>
        {' '}
        <StyledSelect value={selectedVersion} onChange={updateSelectedVersion}>
          {versions.map(version => (
            <Select.Option value={version}>{version}</Select.Option>
          ))}
        </StyledSelect>
      </SelectWrap>
      <SidebarTree menu={{ items: apiMenu }} />
    </Wrap>
  );
}
