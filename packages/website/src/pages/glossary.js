import React, { useMemo, useState } from "react";
import { graphql, useStaticQuery } from 'gatsby';
import { Pagination } from 'antd';
import MDXRenderer from 'gatsby-plugin-mdx/mdx-renderer';
import styled from "styled-components";

import DocsLayout from "@librarium/glossary/src/templates/docs";

//

const LetterWrap = styled.span`
  display: inline-block;
  width: 20px;
  line-height: 21px;
  border: 1px solid #ddd;
  text-align: center;
  margin: 0 4px;
`;

const query = graphql`
{
  allMdx(sort: {fields: frontmatter___title}) {
    edges {
      node {
        body
        fields {
          slug
          title
          icon
          index
          hiddenFromNav
          isDocsPage
          isApiPage
        }
      }
    }
  }
}
`;

const ITEMS_PER_PAGE = 20;

export default function GlossaryList() {
  const {allMdx} = useStaticQuery(query);
  const glossary = {
    edges: allMdx.edges.filter(edge => !edge.node.fields.isDocsPage && !edge.node.fields.isApiPage)
  }

  const menu = {
    edges: allMdx.edges.filter(edge => edge.node.fields.isDocsPage)
  }

  const [page, updatePage] = useState(1)
  const letters = useMemo(() => {
    const letters = glossary.edges.reduce((accumulator, {node}) => {
      const letter = node.fields.slug.split('/')[2]
      accumulator.add(letter)

      return accumulator;
    }, new Set())

    return [...letters];
  }, [glossary.edges])

  function renderLetter(letter) {
  return <LetterWrap>{letter}</LetterWrap>;
  }

  function renderItem({node}) {
    return <>
      <MDXRenderer>{node.body}</MDXRenderer>
    </>
  }

  const items = useMemo(() => {
    return glossary.edges.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE )
  }, [glossary.edges, page])

  const pageCount = glossary.edges.length / ITEMS_PER_PAGE;

  return (
    <DocsLayout menuEdges={menu.edges || []}>
      {letters.map(renderLetter)}
      {items.map(renderItem)}
      {pageCount > 1 && <Pagination current={page} total={glossary.edges.length} pageSize={ITEMS_PER_PAGE} onChange={(page) => updatePage(page)} />}
    </DocsLayout>
  )
}
