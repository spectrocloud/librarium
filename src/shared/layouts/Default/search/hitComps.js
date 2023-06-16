import React from "react";
import styled from "styled-components";
import { Highlight, Snippet } from "react-instantsearch-dom";
import { Link } from "gatsby";

const Wrap = styled.div`
  cursor: pointer;
  a:hover {
    color: unset;
  }
`;

const SearchResultLink = styled.div`
  color: #206cd1;
  font-weight: 500;
  font-size: 18px;
`;

export const PageHit = ({ hit, onClick }) => (
  <Wrap>
    <Link to={hit.slug}>
      <div>
        <SearchResultLink>
          <Highlight attribute="title" hit={hit} tagName="mark" />
        </SearchResultLink>
      </div>
      <Snippet attribute="excerpt" hit={hit} tagName="mark" />
    </Link>
  </Wrap>
);
