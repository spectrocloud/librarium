import React from 'react';
import styled from 'styled-components';

import Link from '../Link';
import SidebarIcon from '../styles/SidebarIcon';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1024px;
  margin: 0 auto;
  overflow: hidden;

  ::after {
    content: ' ';
    max-width: 1109.51px;
    width:100%;
    border: 1px solid #D4D4D4;
    margin-top: 102px;
    margin-bottom: 70px;
  }
`;

const CardsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: -30px;
  width: 100%;

  @media (max-width: 952px) {
    flex-flow: row nowrap;
    overflow-y: auto;
  }
`;

const Card = styled.div`
  width: 312px;
  display: flex;
  align-items: center;
  text-decoration: none;

  background: #ffffff;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 10px;
  margin: 30px 2px 0px;

  @media (max-width: 952px) {
    margin: 20px;
    margin-top: 65px;
  }
`;

const Icon = styled.div`
  height: 80px;
  min-width: 80px;
  border-radius: 50%;
  background: linear-gradient(
    323.78deg,
    rgba(68, 50, 245, 0.05) 11.36%,
    rgba(38, 129, 250, 0.05) 88.9%
  );
  border: 1px solid rgba(68, 50, 245, 0.1);
  margin-right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #409bf6;
  font-size: 20px;

  > svg {
    stroke-width: 0;
    fill: #409bf6;
    stroke: #409bf6;
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
              <Icon>
                <SidebarIcon type={option.icon} />
              </Icon>
              <div>
                <h4>{option.title}</h4>
                <Description>{option.description}</Description>
              </div>
            </Card>
          </Link>
        ))}
      </CardsWrapper>
    </Wrapper>
  );
}

export default QuickSetup;
