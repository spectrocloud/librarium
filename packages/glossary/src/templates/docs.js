import React, { useMemo } from 'react';
import { Layout, DocsLayout, useConfig } from '@librarium/shared';
import App from '../App';

//

export function MDXLayout({children, menuEdges = [], location}) {
  const config = useConfig();

  const menu = useMemo(() => {
    return DocsLayout.calculateMenuTree(menuEdges, config);
  }, [menuEdges]);

  return <Layout menu={menu} location={location}>{children}</Layout>;
}

export default function AppWrap(props) {
  return <App>
    <MDXLayout {...props}/>
  </App>
}
