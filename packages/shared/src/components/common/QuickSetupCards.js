import React from "react";
import styled from "styled-components";

import SidebarIcon from "../styles/SidebarIcon"

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  max-width: 1024px;
  margin: 30px auto 0;
`

const CardWrapper = styled.div`
  width: 312px;
  display: flex;
  align-items: center;

  background: #FFFFFF;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 10px;
  margin-top: 30px;
`;

const Icon = styled.div`
  height: 80px;
  min-width: 80px;
  border-radius: 50%;
  background: linear-gradient(323.78deg, rgba(68, 50, 245, 0.05) 11.36%, rgba(38, 129, 250, 0.05) 88.9%);
  border: 1px solid rgba(68, 50, 245, 0.1);
  margin-right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;

  > svg {
    stroke-width: 0;
    fill: #409BF6;
    stroke: #409BF6;
  }
`;

function QuickSetupCards({ options = [] }) {
  return (
    <Wrapper>
      {options.map(option => (
        <CardWrapper>
          <Icon><SidebarIcon type={option.icon} /></Icon>
          <div>
            <h4>{option.title}</h4>
            <div>{option.description}</div>
          </div>
        </CardWrapper>
      ))
    }
    </Wrapper>
  )
}

export default QuickSetupCards;
