import React from "react";
import styled from "styled-components";
import { Highlight, Snippet } from "react-instantsearch-dom";
import { Link } from "gatsby";

const StyledLink = styled(Link)`
  cursor: pointer;
  display: block;
  &:hover {
    color: unset;
  }
`;

const SearchResultLink = styled.div`
  color: #206cd1;
  font-weight: 500;
  font-size: 18px;
`;

export const PageHit = ({ hit, onClick }) => (
  <StyledLink to={hit.slug} onClick={onClick}>
    <div>
      <SearchResultLink>
        <Highlight attribute="title" hit={hit} tagName="mark" />
      </SearchResultLink>
    </div>
    <Snippet attribute="excerpt" hit={hit} tagName="mark" />
  </StyledLink>
);
