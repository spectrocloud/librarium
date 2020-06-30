import React from "react";
import styled from "styled-components";

import background from "../../assets/blue-hero-background.png"
import {IntroButtons} from "../../components";

const Wrapper = styled.div`
  margin-top: -80px;
  height: 492px;
  background: url(${background});
  background-size: cover;
  padding: 105px 45px 45px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h1, h3, span, a {
    color: #fff;
  }

  h3 {
    margin: 15px;
    /* font-weight: 500; */
  }

  span {
    max-width: 680px;
    text-align: center;
  }
`;

function MainHeader({ }) {
  return (
    <Wrapper>
      <h1>Documentation</h1>
      <h3>Introductive Tutorial</h3>
      <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sed faucibus nisi, a porta nisi. In hac habitasse platea dictumst.</span>
      <IntroButtons display="vertical" />
    </Wrapper>
  )
}

export default MainHeader;
