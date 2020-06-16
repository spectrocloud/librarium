import React, { useMemo } from 'react';
import { graphql } from 'gatsby';
import { Layout, DocsLayout } from '@librarium/shared';
import Integrations from '@librarium/docs/src/components/Integrations';
import App from "../App"

//

export default function IntegrationsTemplate({ children, data, ...rest }) {
  const integrations = data.allMdx.edges.filter(edge => edge.node.fields.isIntegration);
  const menu = useMemo(() => {
    return DocsLayout.calculateMenuTree(data.allMdx.edges.filter(edge => edge.node.fields.isDocsPage));
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
{
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
          isDocsPage
          logoUrl
        }
      }
    }
  }
}
`;
