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

export function MDXLayout({children, location}) {
  const data = useStaticQuery(menuQuery)
  const { allMdx } = data
  const config = useConfig();

  const menu = useMemo(() => {
    return DocsLayout.calculateMenuTree(allMdx.edges, config);
  }, [allMdx.edges]);

  return <Layout location={location} menu={menu}>{children}</Layout>;
}

export default function AppWrap({children, location}) {
  return <App>
    <MDXLayout location={location}> {children} </MDXLayout>
  </App>
}
