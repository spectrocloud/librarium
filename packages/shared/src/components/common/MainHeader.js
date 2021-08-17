import React from 'react';
import styled from 'styled-components';

import { IntroButtons } from '../../components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;

  h1,
  h3,
  a {
    color: inherit !important;
  }

  h3 {
    margin: 15px 0;
  }

  span {
    max-width: 680px;
    text-align: center;
  }

  @media (max-width: 830px) {
    padding: 45px;
  }

  @media (max-width: 400px) {
    height: 600px;
    padding: 45px;
  }
`;

function MainHeader({ children, introductionHref, demoHref }) {
  return (
    <Wrapper>
      {children}
      <IntroButtons display="vertical" introductionHref={introductionHref} demoHref={demoHref} />
    </Wrapper>
  );
}

export default MainHeader;
