import React, { useMemo } from 'react';
import { graphql } from 'gatsby';
import { Layout, DocsLayout } from '@librarium/shared';
import App from '../App';
import Integrations from '../components/Integrations';

//

export default function IntegrationsTemplate({ children, data, ...rest }) {
  const integrations = data.allMdx.edges.filter(edge => edge.node.fields.isIntegration);
  const menu = useMemo(() => {
    return DocsLayout.calculateMenuTree(data.allMdx.edges);
  }, [data.allMdx.edges]);

  return (
    <App>
      <Layout menu={menu} {...rest}>
        <Integrations edges={integrations} />
      </Layout>
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
          fields {
            id
            slug
            title
            icon
            index
            hiddenFromNav
            category
            isIntegration
            logoUrl
          }
        }
      }
    }
  }
`;
