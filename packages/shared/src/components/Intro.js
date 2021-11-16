import React from 'react';
import styled, { css } from 'styled-components';

import Button from './ui/Button';
import Link from './Link';

//

const IntroWrapper = styled.div``;

export default function IntroSection({ children }) {
  return <IntroWrapper>{children}</IntroWrapper>;
}

const ButtonsWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  button {
    margin-right: 16px;
    background: #206cd1;
    border: 1px solid #206cd1;
    box-shadow: inset 0px -2px 0px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 24px;
    color: #ffffff;
    padding: 16px;
    white-space: nowrap;
    margin-top: 15px
  }

  .request-demo {
    padding: 14px;
    margin-top: 15px;
    text-decoration: none;
    border: 3px solid #6398df;
    box-sizing: border-box;
    border-radius: 8px;
    font-weight: 500;
    font-size: 18px;
    line-height: 24px;
    color: #6398df !important;
    white-space: nowrap;
  }

  @media (max-width: 500px) {
    justify-content: center;

    button {
      margin-right: 0;
    }
  }
`;

export function IntroButtons({ introductionHref, demoHref }) {
  return (
    <ButtonsWrapper>
      <Link to={introductionHref}>
        <Button>Go to chapters</Button>
      </Link>
      <Link className="request-demo" target="_blank" to={demoHref}>
        Request Demo
      </Link>
    </ButtonsWrapper>
  );
}
