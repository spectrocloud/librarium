import React, { useMemo } from "react";
import Helmet from "react-helmet";
import MDXRenderer from "gatsby-plugin-mdx/mdx-renderer";
import styled from "styled-components";
import favicon from "shared/assets/favicon.png";

import { Link, Next, Previous } from "../../components";
import { Edit, StyledMainWrapper } from "../../components/styles/Docs";
import TableOfContents from "../../components/TableOfContents";
import { useLocation } from "@reach/router";
import MDXProvider from "shared/mdx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const calculateMenuTree = (edges, config) => {
  const originalData = edges
    .filter((edge) => !edge.node.fields.hiddenFromNav)
    .sort((edge1, edge2) => {
      const edgeSlug1Length = edge1.node.fields.slug.split("/").length;
      const edgeSlug2Length = edge2.node.fields.slug.split("/").length;

      const edgeIndex1 = edge1.node.fields.index;
      const edgeIndex2 = edge2.node.fields.index;

      if (edgeSlug1Length < edgeSlug2Length) {
        return -1;
      }

      if (edgeSlug1Length > edgeSlug2Length) {
        return 1;
      }

      if (edgeIndex1 < edgeIndex2) {
        return -1;
      }

      if (edgeIndex1 > edgeIndex2) {
        return 1;
      }
    });

  const tree = originalData.reduce(
    (
      accumulator,
      {
        node: {
          fields: { slug, title, icon, api },
        },
      }
    ) => {
      let slugWithoutBase = slug;
      if (config?.base) {
        slugWithoutBase = slug.split(config.base).pop();
      }
      const parts = slugWithoutBase.split("/");

      let { items: prevItems } = accumulator;

      const slicedParts =
        config?.gatsby && config?.gatsby?.trailingSlash ? parts.slice(1, -2) : parts.slice(1, -1);

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
      const slicedLength = config?.gatsby?.trailingSlash ? parts.length - 2 : parts.length - 1;

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
  @media (max-width: 1100px) {
    flex-direction: column-reverse;
  }
`;

const RightSidebar = styled.div`
  margin-left: 50px;
`;

const StickyWrap = styled.div`
  position: sticky;
  top: 100px;
  width: auto;
`;

export default function MDXLayout({
  mdx,
  edges,
  menu,
  docsLocation,
  extraContent,
  hideToC,
  fullWidth,
  hideToCSidebar,
}) {
  const location = useLocation();

  const activeMenu = useMemo(() => {
    if (!location) {
      return [];
    }
    const mainUrl = location.pathname.split("/")[1];
    const nav = menu.items.find((item) => item.label === mainUrl);
    if (!nav) {
      return [];
    }

    return [nav, ...nav.items];
  }, [menu]);

  // meta tags
  const metaTitle = mdx.frontmatter?.metaTitle;
  const metaDescription = mdx.frontmatter?.metaDescription;

  return (
    <>
      <Helmet>
        {metaTitle ? <title>{metaTitle}</title> : null}
        {metaTitle ? <meta name="title" content={metaTitle} /> : null}
        {metaDescription ? <meta name="description" content={metaDescription} /> : null}
        {metaTitle ? <meta property="og:title" content={metaTitle} /> : null}
        {metaDescription ? <meta property="og:description" content={metaDescription} /> : null}
        {metaTitle ? <meta property="twitter:title" content={metaTitle} /> : null}
        {metaDescription ? <meta property="twitter:description" content={metaDescription} /> : null}
        <link rel="icon" href={favicon} type="image/x-icon" />
      </Helmet>

      <MDXProvider>
        <ContentWrap>
          <StyledMainWrapper fullWidth={mdx.frontmatter?.fullWidth || fullWidth}>
            <div className="content">
              <MDXRenderer>{mdx.body}</MDXRenderer>
              {extraContent}
            </div>
            <Previous mdx={mdx} nav={activeMenu} />
            <Next mdx={mdx} nav={activeMenu} />
          </StyledMainWrapper>
          {!hideToCSidebar && !mdx.frontmatter?.hideToCSidebar && (
            <RightSidebar>
              <StickyWrap>
                <Edit>
                  {docsLocation && (
                    <Link target="_blank" to={`${docsLocation}/${mdx.parent.relativePath}`}>
                      <FontAwesomeIcon icon={["fab", "github"]} /> Edit on GitHub
                    </Link>
                  )}
                </Edit>
                {!hideToC && !mdx.frontmatter?.hideToC && <TableOfContents edges={edges} />}
              </StickyWrap>
            </RightSidebar>
          )}
        </ContentWrap>
      </MDXProvider>
    </>
  );
}

MDXLayout.calculateMenuTree = calculateMenuTree;
