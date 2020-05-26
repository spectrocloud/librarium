import React, { useMemo, useState } from "react";
import { graphql, useStaticQuery } from 'gatsby';
import { Pagination } from 'antd';
import MDXRenderer from 'gatsby-plugin-mdx/mdx-renderer';

import DocsLayout from "../layouts/docs";

//

const menuQuery = graphql`
{
  allMdx(filter: {fileAbsolutePath: {regex: "/glossary/content/"}}, sort: {fields: frontmatter___title}) {
    edges {
      node {
        body
        fields {
          slug
          title
        }
      }
    }
  }
}
`;

const ITEMS_PER_PAGE = 2;

export default function GlossaryList() {
  const {allMdx} = useStaticQuery(menuQuery);
  const [page, updatePage] = useState(1)

  const letters = useMemo(() => {
    const letters = allMdx.edges.reduce((accumulator, {node}) => {
      const letter = node.fields.slug.split('/')[2]
      accumulator.add(letter)

      return accumulator;
    }, new Set())

    return [...letters];
  }, [allMdx.edges])

  function renderLetter(letter) {
    return letter;
  }

  function renderItem({node}) {
    return <>
      <MDXRenderer>{node.body}</MDXRenderer>
    </>
  }

  const items = useMemo(() => {
    return allMdx.edges.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE )
  }, [allMdx.edges, page])

  return (
    <DocsLayout>
      {letters.map(renderLetter)}
      {items.map(renderItem)}
      <Pagination current={page} total={allMdx.edges.length} pageSize={ITEMS_PER_PAGE} onChange={(page) => updatePage(page)} />
    </DocsLayout>
  )
}
