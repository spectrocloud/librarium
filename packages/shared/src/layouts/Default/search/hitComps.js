import React from 'react';
import styled from 'styled-components';
import { Highlight, Snippet } from 'react-instantsearch-dom';
import { Link } from 'gatsby';

const Wrap = styled.div`
  a {
    font-size:18px;
    color: #4432F5;
  }
`;

export const PageHit = clickHandler => ({ hit }) => (
  <Wrap>
    <div>
      <Link to={hit.slug} onClick={clickHandler}>
        <Highlight attribute="title" hit={hit} tagName="mark" />
      </Link>
    </div>
    <Snippet attribute="excerpt" hit={hit} tagName="mark" />
  </Wrap>
);
