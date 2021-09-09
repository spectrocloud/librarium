import React from 'react';
import styled from 'styled-components';

import Link from '../Link';
import SidebarIcon from '../styles/SidebarIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1110px;
  margin: 0 auto;
  overflow: hidden;

  ::after {
    content: ' ';
    max-width: 1109.51px;
    width: 100%;
    border: 1px solid #d4d4d4;
    margin-top: 102px;
  }

  h3 {
    margin-bottom: 50px !important;
    margin-top: 102px !important;
  }
`;

const CardsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 18px;
  width: 100%;
  @media (max-width: 952px) {
    flex-flow: row nowrap;
    overflow-y: auto;
    > a {
      margin: 20px;
      margin-top: 65px;
    }
  }
`;

const Card = styled.div`
  width: 350px;
  height: 355px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  text-decoration: none;
  cursor: pointer;
  background: #ffffff;
  border: 1px solid #f3f8ff;
  box-sizing: border-box;
  box-shadow: 0px 24px 38px -20px rgba(21, 24, 50, 0.19);
  border-radius: 12px 12px 0px 0px;
  padding: 54px 32px;
  margin-top: 15px;

  h4 {
    font-style: normal;
    font-weight: 500;
    font-size: 24px;
    line-height: 28px;
    color: #2d2e55;
    margin-bottom: 24px;
  }
`;

const Icon = styled.div`
  height: 114px;
  min-width: 114px;
  border-radius: 50%;
  box-shadow: 0px 5.42752px 14.9257px -2.71376px rgba(21, 24, 51, 0.22);
  border: 1px solid rgba(68, 50, 245, 0.1);
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #409bf6;
  font-size: 40px;
  > svg {
    stroke-width: 0;
    fill: #409bf6;
    stroke: #409bf6;
    width: 61px;
    height: 61px;
  }
`;

const LearnMore = styled.div`
  height: 68px;
  background: #206cd1;
  padding: 20px 48px;
  border-radius: 0px 0px 12px 12px;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #ffffff;
`;

const Description = styled.div`
  font-weight: normal;
  font-size: 16px;
  line-height: 22px;
  color: #666a80;
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
            <LearnMore>
              <div>Learn More</div>
              <FontAwesomeIcon icon={'arrow-right'} />
            </LearnMore>
          </Link>
        ))}
      </CardsWrapper>
    </Wrapper>
  );
}

export default QuickSetup;
