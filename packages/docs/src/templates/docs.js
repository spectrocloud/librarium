import React, { useMemo } from 'react';
import Helmet from 'react-helmet';
import { graphql } from 'gatsby';
import MDXRenderer from 'gatsby-plugin-mdx/mdx-renderer';
import styled from 'styled-components';

import { Layout, Link } from '@librarium/shared';
import NextPrevious from '../components/NextPrevious';
import config from '../../config';
import { Edit, StyledMainWrapper } from '../components/styles/Docs';
import TableOfContents from '../components/TableOfContents';
import { Github } from 'styled-icons/fa-brands';
import App from '../App';

const calculateTreeData = (edges, config) => {
  const originalData = edges
    .filter(edge => !edge.node.fields.hiddenFromNav)
    .sort((edge1, edge2) => {
      return edge1.node.fields.index - edge2.node.fields.index;
    });
  const tree = originalData.reduce(
    (
      accu,
      {
        node: {
          fields: { slug, title, icon },
        },
      }
    ) => {
      const parts = slug.split('/');

      let { items: prevItems } = accu;

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
        prevItems.push({
          label: parts[slicedLength],
          url: slug,
          items: [],
          title,
          icon,
        });
      }
      return accu;
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
`

const StickyWrap = styled.div`
  position: sticky;
  top: 100px;
  width: 150px;
`

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

  return (
    <App>
      <Layout menu={menu}>
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
          <StyledMainWrapper>
            <MDXRenderer>{mdx.body}</MDXRenderer>
            <div>
              <NextPrevious mdx={mdx} nav={activeMenu} />
            </div>
          </StyledMainWrapper>
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
          }
        }
      }
    }
  }
`;
