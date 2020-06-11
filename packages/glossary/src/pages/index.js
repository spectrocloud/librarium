import React, { useMemo, useState } from "react";
import { graphql, useStaticQuery } from 'gatsby';
import { Pagination } from 'antd';
import MDXRenderer from 'gatsby-plugin-mdx/mdx-renderer';
import styled from "styled-components";

import DocsLayout from "../layouts/docs";

//

const LetterWrap = styled.span`
  display: inline-block;
  width: 20px;
  line-height: 21px;
  border: 1px solid #ddd;
  text-align: center;
  margin: 0 4px;
`;

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

const ITEMS_PER_PAGE = 20;

export default function GlossaryList({location}) {
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
  return <LetterWrap>{letter}</LetterWrap>;
  }

  function renderItem({node}) {
    return <>
      <MDXRenderer>{node.body}</MDXRenderer>
    </>
  }

  const items = useMemo(() => {
    return allMdx.edges.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE )
  }, [allMdx.edges, page])

  const pageCount = allMdx.edges.length / ITEMS_PER_PAGE;

  return (
    <DocsLayout location={location}>
      {letters.map(renderLetter)}
      {items.map(renderItem)}
      {pageCount > 1 && <Pagination current={page} total={allMdx.edges.length} pageSize={ITEMS_PER_PAGE} onChange={(page) => updatePage(page)} />}
    </DocsLayout>
  )
}
