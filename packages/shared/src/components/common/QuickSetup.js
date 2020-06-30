import React from "react";
import styled from "styled-components";

import Link from "../Link";
import SidebarIcon from "../styles/SidebarIcon"

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1024px;
  margin: 0 auto;

  ::after {
    content: " ";
    width: 680px;
    border: 1px solid #DDDDDD;
    margin-top: 60px;
  }
`;

const CardsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: -30px;
`

const Card = styled.div`
  width: 312px;
  display: flex;
  align-items: center;
  text-decoration: none;

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

const Description = styled.div`
  color: #111;
  font-size: 14px;
  line-height: 21px;
`;


function QuickSetup({ title, options = [] }) {
  return (
    <Wrapper>
      <h3>{title}</h3>
      <CardsWrapper>
        {options.map(option => (
          <Link key={option.title} to={option.href}>
            <Card>
              <Icon><SidebarIcon type={option.icon} /></Icon>
              <div>
                <h4>{option.title}</h4>
                <Description>{option.description}</Description>
              </div>
            </Card>
          </Link>
        ))
        }
      </CardsWrapper>
    </Wrapper>
  )
}

export default QuickSetup;
