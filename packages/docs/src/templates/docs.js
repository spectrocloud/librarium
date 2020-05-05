import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { graphql } from 'gatsby';
import MDXRenderer from 'gatsby-plugin-mdx/mdx-renderer';

import { Layout, Link } from '@librarium/shared';
import NextPrevious from '../components/NextPrevious';
import config from '../../config';
import { Edit, StyledMainWrapper } from '../components/styles/Docs';
import { Github } from 'styled-icons/fa-brands';
import App from "../App";


const forcedNavOrder = config.sidebar.forcedNavOrder;

export default class MDXRuntimeTest extends Component {
  render() {
    const { data } = this.props;

    if (!data) {
      return null;
    }
    const {
      allMdx,
      mdx,
      site: {
        siteMetadata: { docsLocation, title },
      },
    } = data;

    const navItems = allMdx.edges
      .map(({ node }) => node.fields.slug)
      .filter(slug => slug !== '/')
      .sort()
      .reduce(
        (acc, cur) => {
          if (forcedNavOrder.find(url => url === cur)) {
            return { ...acc, [cur]: [cur] };
          }

          let prefix = cur.split('/')[1];

          if (config.gatsby && config.gatsby.trailingSlash) {
            prefix = prefix + '/';
          }

          if (prefix && forcedNavOrder.find(url => url === `/${prefix}`)) {
            return { ...acc, [`/${prefix}`]: [...acc[`/${prefix}`], cur] };
          } else {
            return { ...acc, items: [...acc.items, cur] };
          }
        },
        { items: [] }
      );

    const nav = forcedNavOrder
      .reduce((acc, cur) => {
        return acc.concat(navItems[cur]);
      }, [])
      .concat(navItems.items)
      .map(slug => {
        if (slug) {
          const { node } = allMdx.edges.find(({ node }) => node.fields.slug === slug);

          return { title: node.fields.title, url: node.fields.slug };
        }
      });

      if (!mdx) {
      return  <Layout {...this.props}>{null}</Layout>;
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
        <Layout {...this.props} edges={allMdx.edges}>
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
          <div>
            <Edit>
              {docsLocation && (
                <Link to={`${docsLocation}/${mdx.parent.relativePath}`}>
                  <Github icon="github" width="16px" /> Edit on GitHub
                </Link>
              )}
            </Edit>
          </div>
          <StyledMainWrapper>
            <MDXRenderer>{mdx.body}</MDXRenderer>
          </StyledMainWrapper>
          <div>
            <NextPrevious mdx={mdx} nav={nav} />
          </div>
        </Layout>
      </App>
    );
  }
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
          }
        }
      }
    }
  }
`;
