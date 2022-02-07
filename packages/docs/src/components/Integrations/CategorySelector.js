import React from 'react';
import styled, { css } from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 15px;
  margin-bottom: 15px;
`;

const SelectorCard = styled.div`
  padding: 4px 12px;
  background: #fafafa;
  border: 1px solid #dddddd;
  border-radius: 13px;
  margin: 0 10px 10px 0;
  font-weight: 500;
  font-size: 11px;
  line-height: 18px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #555;
  cursor: pointer;
  ${props =>
    props.selected &&
    css`
      background: #206cd1;
      border: 1px solid #206cd1;
      color: #fff;
    `}
`;

export default function CategorySelector({ categories, selected = 'all', selectCategory }) {
  return (
    <Wrapper>
      {categories.map((category, index) => (
        <SelectorCard
          key={index}
          onClick={() => selectCategory(category)}
          selected={selected === category}
        >
          {category.split('_').join(' ')}
        </SelectorCard>
      ))}
    </Wrapper>
  );
}
