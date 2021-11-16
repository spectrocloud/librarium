import React from 'react';
import styled from 'styled-components';
import { Highlight, Snippet } from 'react-instantsearch-dom';
import { Link } from 'gatsby';

const Wrap = styled.div`
  a {
    font-size:18px;
    color: #206cd1;
  }
`;

export const PageHit = ({ hit, onClick }) => (
  <Wrap>
    <div>
      <Link to={hit.slug} onClick={onClick}>
        <Highlight attribute="title" hit={hit} tagName="mark" />
      </Link>
    </div>
    <Snippet attribute="excerpt" hit={hit} tagName="mark" />
  </Wrap>
);
