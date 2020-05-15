import React, { useMemo } from 'react';
import Helmet from 'react-helmet';
import { graphql, useStaticQuery } from 'gatsby';
import MDXRenderer from 'gatsby-plugin-mdx/mdx-renderer';
import styled from 'styled-components';

import { Layout, Link } from '@librarium/shared';
import config from '../../config';
import { Edit, StyledMainWrapper } from '../components/styles/Docs';
import TableOfContents from '../components/TableOfContents';
import { Github } from 'styled-icons/fa-brands';
import App from '../App';

// TODO: This is the same on docs
// There should be an easy way to send this

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

const menuQuery = graphql`
{
  allMdx(filter: {fileAbsolutePath: {regex: "/docs/content/"}}) {
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

export default function DocsLayout({children}) {
  const data = useStaticQuery(menuQuery)
  const { allMdx } = data

  console.log(data);

  const menu = useMemo(() => {
    return calculateTreeData(allMdx.edges, config);
  }, [allMdx.edges]);

  return <App><Layout menu={menu}>{children}</Layout></App>;
}
