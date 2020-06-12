import React, { useMemo } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { Layout, DocsLayout, useConfig } from '@librarium/shared';
import App from '../App';

//

const menuQuery = graphql`
{
  allMdx(filter: {fileAbsolutePath: {regex: "/docs/content/"}}) {
    edges {
      node {
        fields {
          slug
          title
          icon
          index
          hiddenFromNav
        }
      }
    }
  }
}
`;

export function MDXLayout({children}) {
  const data = useStaticQuery(menuQuery);
  const { allMdx } = data;
  const config = useConfig();

  const menu = useMemo(() => {
    return DocsLayout.calculateMenuTree(allMdx.edges, config);
  }, [allMdx.edges]);

  return <Layout menu={menu}>{children}</Layout>;
}

export default function AppWrap({children}) {
  return <App>
    <MDXLayout> {children} </MDXLayout>
  </App>
}
