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
    .reduce(
      (
        accumulator,
        {
          node: {
            fields: { slug, title, icon, version, api },
          },
        }
      ) => {
        if (selectedVersion === version && api) {
          accumulator.push({
            url: slug,
            title,
            icon,
          });
        }

        return accumulator;
      },
      []
    );
};

export default function ApiSidebar({ allMdx, branches, initialCount }) {
  const versions = useMemo(() => {
    return getVersions(allMdx.edges);
  }, [allMdx.edges]);

  const [selectedVersion, updateSelectedVersion] = useState(versions[0]);

  const menuBranches = useMemo(() => {
    const apiMenu = extractApiMenu(allMdx.edges, selectedVersion);

    return apiMenu.reduce((acc, curr) => {
      const rootUrl = curr.url.replace("/api/v1/", "");

      if (Object.keys(branches).includes(rootUrl)) {
        let branchName = rootUrl;

        if (rootUrl === "cloudconfig") {
          branchName = "cloudconfigs";
        }

        if (rootUrl === "clusters") {
          branchName = "spectroclusters";
        }

        acc[rootUrl] = branches[branchName];
        acc[rootUrl].title = curr.title;
      }
      return acc;
    }, {});
  }, [allMdx.edges, branches, selectedVersion]);

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
      <ApiSidebarTree initialCount={initialCount} branches={menuBranches} />
    </Wrap>
  );
}
