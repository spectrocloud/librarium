import React, { useMemo } from 'react';
import { graphql } from 'gatsby';
import { Layout, DocsLayout } from '@librarium/shared';
import config from '../../config';
import ApiSidebar from '../components/ApiSidebar';
import Swagger from '../components/Swagger';
import App from '../App';

// TODO use graphql to get api.jsons
import v1 from '../../content/v1/api.json';

const APIS = {
  v1,
};

export default function MDXLayout({ data = {}, location }) {
  const {
    allMdx,
    mdx,
    site: {
      siteMetadata: { docsLocation },
    },
  } = data;

  const menu = useMemo(() => {
    return DocsLayout.calculateMenuTree(allMdx.edges, {...config, base: '/api'});
  }, [allMdx.edges]);

  function renderAPIDoc() {
    const paths = mdx.frontmatter?.paths;
    if (!paths || !mdx?.fields?.version) {
      return null;
    }

    const api = APIS[mdx?.fields?.version];

    const endpoints = Object.keys(api.paths)
      .filter(path => paths.some(entry => path.startsWith(entry)))
      .filter(path => !path.split("/").includes("internal"))
      .map(path => {
        return {
          path,
          operations: Object.keys(api.paths[path])
            .filter(method => method !== "parameters")
            .filter(method => !api.paths[path][method]?.tags?.some(tag => ["private", "system"].includes(tag)))
            .map(method => ({
              method,
              ...api.paths[path][method],
              parameters: api.paths[path][method].parameters || [],
              responseMessages: Object.keys(api.paths[path][method].responses || {}).map(
                response => ({
                  ...api.paths[path][method].responses[response],
                })
              ),
            })),
        };
      });

    return <Swagger documentation={{ apis: endpoints }} prefix="https://api.spectrocloud.com" />;
  }

  return (
    <App>
      <Layout
        location={location}
        menu={menu}
        fullWidth={mdx.frontmatter?.fullWidth}
        logoLocation="/api"
        subLogo={
          <path
            d="M141.917 41.005H137.747L137.057 43H134.852L138.617 32.515H141.062L144.827 43H142.607L141.917 41.005ZM141.347 39.325L139.832 34.945L138.317 39.325H141.347ZM154.619 35.77C154.619 36.33 154.484 36.855 154.214 37.345C153.954 37.835 153.539 38.23 152.969 38.53C152.409 38.83 151.699 38.98 150.839 38.98H149.084V43H146.984V32.53H150.839C151.649 32.53 152.339 32.67 152.909 32.95C153.479 33.23 153.904 33.615 154.184 34.105C154.474 34.595 154.619 35.15 154.619 35.77ZM150.749 37.285C151.329 37.285 151.759 37.155 152.039 36.895C152.319 36.625 152.459 36.25 152.459 35.77C152.459 34.75 151.889 34.24 150.749 34.24H149.084V37.285H150.749ZM158.96 32.53V43H156.86V32.53H158.96Z"
            fill="url(#paint1_linear)"
          />
        }
        extraMenu={<ApiSidebar allMdx={allMdx} />}
      >
        <DocsLayout
          menu={menu}
          mdx={mdx}
          docsLocation={docsLocation}
          hideToC={mdx.frontmatter?.api}
          edges={allMdx.edges}
          extraContent={renderAPIDoc()}
          location={location}
        />
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
        version
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
        paths
        hideToCSidebar
        api
      }
    }
    allMdx(filter: {fields: {isApiPage: {eq: true}}}) {
      edges {
        node {
          tableOfContents
          fields {
            slug
            title
            icon
            index
            hiddenFromNav
            api
            version
          }
        }
      }
    }
  }
`;
