import React, { useMemo } from 'react';
import { graphql } from 'gatsby';

import { Layout, DocsLayout } from 'shared';
import App from '../App';
import config from '../../../config'

function MDXLayout({ data = {}, children, ...rest }) {
  const {
    allMdx,
    mdx,
    site: {
      siteMetadata: { docsLocation },
    },
  } = data;

  const menu = useMemo(() => {
    return DocsLayout.calculateMenuTree(allMdx.edges.filter(edge => !!edge.node.fields.isDocsPage), config);
  }, [allMdx.edges]);

  return (
    <Layout
      menu={menu}
      fullWidth={mdx.frontmatter?.fullWidth}
      hideMenuSidebar={mdx.frontmatter?.hideMenuSidebar}
    >
      <DocsLayout
        menu={menu}
        mdx={mdx}
        edges={allMdx.edges}
        docsLocation={docsLocation}
        {...rest}
      />
    </Layout>
  );
}

export default function AppWrap(props) {
  return (
    <App pageContext={props.pageContext}>
      <MDXLayout {...props} />
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
        hideToCSidebar
        hideMenuSidebar
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
            isDocsPage
          }
        }
      }
    }
  }
`;
