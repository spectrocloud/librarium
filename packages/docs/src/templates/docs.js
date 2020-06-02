import React, { useMemo } from 'react';
import { graphql } from 'gatsby';

import { Layout, DocsLayout, useConfig } from '@librarium/shared';
import App from '../App';

function MDXLayout({ data = {}, location }) {
  const {
    allMdx,
    mdx,
    site: {
      siteMetadata: { docsLocation },
    },
  } = data;
  const config = useConfig();

  const menu = useMemo(() => {
    return DocsLayout.calculateMenuTree(allMdx.edges, config);
  }, [allMdx.edges]);

  return (
    <Layout menu={menu} fullWidth={mdx.frontmatter?.fullWidth}>
      <DocsLayout
        menu={menu}
        mdx={mdx}
        edges={allMdx.edges}
        docsLocation={docsLocation}
        location={location}
      />
    </Layout>
  );
}

export default function AppWrap({ children, data, location }) {
  return (
    <App>
      <MDXLayout data={data} location={location}>
        {children}
      </MDXLayout>
    </App>
  );
}

export const pageQuery = graphql`
  query($id: String!) {
    site {
      siteMetadata {
        title
        docsLocation
      }
    }
    mdx(fields: { id: { eq: $id } }) {
      fields {
        id
        title
        slug
      }
      body
      tableOfContents
      parent {
        ... on File {
          relativePath
        }
      }
      frontmatter {
        metaTitle
        metaDescription
        fullWidth
        hideToC
      }
    }
    allMdx {
      edges {
        node {
          tableOfContents
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
