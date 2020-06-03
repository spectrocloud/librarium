import React from "react";
import styled, { css } from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 15px;
`;

const SelectorCard = styled.div`
  padding: 4px 12px;
  background: #FAFAFA;
  border: 1px solid #DDDDDD;
  border-radius: 13px;
  margin: 0 10px 10px 0;
  font-weight: 500;
  font-size: 11px;
  line-height: 18px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #555;
  cursor: pointer;

  ${props => props.selected && css`
      background: #4432F5;
      border: 1px solid #4432F5;
      color: #fff;
  `}
`;

function CategorySelector({ categories, selected = "all", selectCategory }) {
  return (
    <Wrapper>
      {categories.map((category) => (
        <SelectorCard
          onClick={() => selectCategory(category)}
          selected={selected === category}>
          {category.split("_").join(" ")}
        </SelectorCard>
      ))}
    </Wrapper>
  )
}

export default CategorySelector;
