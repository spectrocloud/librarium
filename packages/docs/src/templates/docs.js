import React, { useMemo } from 'react';
import { graphql } from 'gatsby';

import { Layout, DocsLayout, useConfig } from '@librarium/shared';
import App from '../App';

import Integrations from '../components/Integrations';
import integrations from '../../content/6-integrations/integrations.json';

function MDXLayout({ data = {} }) {
  const {
    allMdx,
    mdx,
    site: {
      siteMetadata: { docsLocation },
    },
  } = data;
  const config = useConfig();


  function renderIntegration() {
    if(integrations[mdx.frontmatter?.category]) {
      return <Integrations data={integrations[mdx.frontmatter?.category]}/>;
    }
  }

  const menu = useMemo(() => {
    return DocsLayout.calculateMenuTree(allMdx.edges, config);
  }, [allMdx.edges]);

  return (
      <Layout menu={menu} fullWidth={mdx.frontmatter?.fullWidth}>
        <DocsLayout menu={menu} mdx={mdx} edges={allMdx.edges} docsLocation={docsLocation} extraContent={renderIntegration()}/>
      </Layout>
  );
}

export default function AppWrap({children, data}) {
  return <App>
    <MDXLayout data={data}>{children}</MDXLayout>
  </App>
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
        isIntegration
        category
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
