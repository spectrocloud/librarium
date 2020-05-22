import React, { useMemo, useState } from "react";
import { SidebarTree } from '@librarium/shared';
import { Select } from 'antd';

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
        accumulator.add(version)
      }

      return accumulator;
    }, new Set());


  return [...versions].sort().reverse(); s
};

const extractApiMenu = (edges, selectedVersion) => {
  return edges.reduce(
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
        })
      }

      return accumulator;

    }, []);
};

export default function ApiSidebar({ allMdx }) {

  const versions = useMemo(() => {
    return getVersions(allMdx.edges);
  }, [allMdx.edges])

  const [selectedVersion, updateSelectedVersion] = useState(versions[0]);
  const apiMenu = useMemo(() => {
    return extractApiMenu(allMdx.edges, selectedVersion);
  }, [allMdx.edges, selectedVersion]);

  return <div>
    <Select value={selectedVersion} onChange={updateSelectedVersion}>
      {versions.map(version => <Select.Option value={version}>{version}</Select.Option>)}
    </Select>
    <SidebarTree menu={{ items: apiMenu }} />

  </div>
}
