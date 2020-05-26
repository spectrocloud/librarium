import React, { useMemo } from 'react';
import Helmet from 'react-helmet';
import { graphql } from 'gatsby';
import MDXRenderer from 'gatsby-plugin-mdx/mdx-renderer';
import styled from 'styled-components';

import { Layout, Link } from '@librarium/shared';
import NextPrevious from '../components/NextPrevious';
import config from '../../config';
import { Edit, StyledMainWrapper } from '../components/styles/Docs';
import ApiSidebar from "../components/ApiSidebar";
import TableOfContents from '../components/TableOfContents';
import Swagger from '../components/Swagger';
import { Github } from 'styled-icons/fa-brands';
import App from '../App';

// TODO use graphql to get api.jsons
import v1 from "../../content/v1/api.json";
import v2 from "../../content/v2/api.json";

const APIS = {
  v1,
  v2
}


const calculateTreeData = (edges, config) => {
  const originalData = edges
    .filter(edge => !edge.node.fields.hiddenFromNav)
    .sort((edge1, edge2) => {
      return edge1.node.fields.index - edge2.node.fields.index;
    });
  const tree = originalData.reduce(
    (
      accumulator,
      {
        node: {
          fields: { slug, title, icon, version, api },
        },
      }
    ) => {
      const parts = slug.split('/');

      let { items: prevItems } = accumulator;

      const slicedParts =
        config.gatsby && config.gatsby.trailingSlash ? parts.slice(1, -2) : parts.slice(1, -1);

      for (const part of slicedParts) {
        let tmp = prevItems && prevItems.find(({ label }) => label == part);

        if (tmp) {
          if (!tmp.items) {
            tmp.items = [];
          }
        } else {
          tmp = { label: part, items: [] };
          prevItems.push(tmp);
        }
        prevItems = tmp.items;
      }
      const slicedLength =
        config.gatsby && config.gatsby.trailingSlash ? parts.length - 2 : parts.length - 1;

      const existingItem = prevItems.find(({ label }) => label === parts[slicedLength]);

      if (existingItem) {
        existingItem.url = slug;
        existingItem.title = title;
        existingItem.icon = icon;
      } else {
        if (api) {
          return accumulator;
        }
        prevItems.push({
          label: parts[slicedLength],
          url: slug,
          items: [],
          title,
          icon,
        });
      }

      return accumulator;
    },
    { items: [] }
  );

  return tree;
};

const ContentWrap = styled.div`
  display: flex;
`;

const RightSidebar = styled.div`
  margin-left: 20px;
`;

const StickyWrap = styled.div`
  position: sticky;
  top: 100px;
  width: 150px;
`;

export default function MDXLayout({ data = {} }) {
  const {
    allMdx,
    mdx,
    site: {
      siteMetadata: { docsLocation },
    },
  } = data;

  const menu = useMemo(() => {
    return calculateTreeData(allMdx.edges, config);
  }, [allMdx.edges]);

  const activeMenu = useMemo(() => {
    const mainUrl = window.location.pathname.split('/')[1];
    const nav = menu.items.find(item => item.label === mainUrl);
    if (!nav) {
      return [];
    }

    return [nav, ...nav.items];
  });

  if (!mdx) {
    return <Layout>{null}</Layout>;
  }

  // meta tags
  const metaTitle = mdx.frontmatter?.metaTitle;

  const metaDescription = mdx.frontmatter?.metaDescription;

  let canonicalUrl = config.gatsby.siteUrl;

  canonicalUrl =
    config.gatsby.pathPrefix !== '/' ? canonicalUrl + config.gatsby.pathPrefix : canonicalUrl;
  canonicalUrl = canonicalUrl + mdx.fields.slug;

  function renderAPIDoc() {
    const paths = mdx.frontmatter?.paths;
    if (!paths || !mdx?.fields?.version) {
      return null;
    }

    const api = APIS[mdx?.fields?.version];
    console.log(Object.keys(api.paths), paths)
    const endpoints = Object.keys(api.paths).filter(path => paths.some(entry => path.startsWith(entry))).map(path => {
      return {
        path,
        operations: Object.keys(api.paths[path]).map(method => ({
          method,
          ...api.paths[path][method],
          parameters: api.paths[path][method].parameters || [],
          responseMessages: Object.keys(api.paths[path][method].responses || {}).map(response => ({
            ...api.paths[path][method].responses[response]
          }))
        }))
      }
    })
    return <Swagger documentation={{apis: endpoints}} prefix="https://api.spectrocloud.com" />
  }

  return (
    <App>
      <Layout
        menu={menu}
        fullWidth={mdx.frontmatter?.fullWidth}
        subLogo={
          <path
            d="M141.917 41.005H137.747L137.057 43H134.852L138.617 32.515H141.062L144.827 43H142.607L141.917 41.005ZM141.347 39.325L139.832 34.945L138.317 39.325H141.347ZM154.619 35.77C154.619 36.33 154.484 36.855 154.214 37.345C153.954 37.835 153.539 38.23 152.969 38.53C152.409 38.83 151.699 38.98 150.839 38.98H149.084V43H146.984V32.53H150.839C151.649 32.53 152.339 32.67 152.909 32.95C153.479 33.23 153.904 33.615 154.184 34.105C154.474 34.595 154.619 35.15 154.619 35.77ZM150.749 37.285C151.329 37.285 151.759 37.155 152.039 36.895C152.319 36.625 152.459 36.25 152.459 35.77C152.459 34.75 151.889 34.24 150.749 34.24H149.084V37.285H150.749ZM158.96 32.53V43H156.86V32.53H158.96Z"
            fill="url(#paint1_linear)"
          />
        }
        extraMenu={<ApiSidebar allMdx={allMdx}/>}
      >
        <Helmet>
          {metaTitle ? <title>{metaTitle}</title> : null}
          {metaTitle ? <meta name="title" content={metaTitle} /> : null}
          {metaDescription ? <meta name="description" content={metaDescription} /> : null}
          {metaTitle ? <meta property="og:title" content={metaTitle} /> : null}
          {metaDescription ? <meta property="og:description" content={metaDescription} /> : null}
          {metaTitle ? <meta property="twitter:title" content={metaTitle} /> : null}
          {metaDescription ? (
            <meta property="twitter:description" content={metaDescription} />
          ) : null}
          <link rel="canonical" href={canonicalUrl} />
        </Helmet>

        <ContentWrap>
          <StyledMainWrapper fullWidth={mdx.frontmatter?.fullWidth}>
            <MDXRenderer>{mdx.body}</MDXRenderer>
            {renderAPIDoc()}
            <div>
              <NextPrevious mdx={mdx} nav={activeMenu} />
            </div>
          </StyledMainWrapper>
          {!mdx.frontmatter?.hideToC && (
            <RightSidebar>
              <StickyWrap>
                <Edit>
                  {docsLocation && (
                    <Link to={`${docsLocation}/${mdx.parent.relativePath}`}>
                      <Github icon="github" width="16px" /> Edit on GitHub
                    </Link>
                  )}
                </Edit>
                <TableOfContents location={window.location} />
              </StickyWrap>
            </RightSidebar>
          )}
        </ContentWrap>
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
      }
    }
    allMdx {
      edges {
        node {
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
