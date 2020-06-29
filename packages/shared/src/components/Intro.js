import React from "react";
import styled, { css } from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import background from "../assets/hero-background.png"
import Button from "./ui/Button";
import Link from "./Link";

//

const IntroWrapper = styled.div`
  background-image: url(${background});
  background-size: cover;
  padding: 43px;
  margin: 0 -43px 20px -43px;
`

export default function IntroSection({ children }) {
  return <IntroWrapper>{children}</IntroWrapper>
}


const ButtonsWrapper = styled.div`
  margin: 16px -16px;
  button {
    margin: 0 16px;
  }

  a {
    text-decoration: none;
  }

  ${props => props.display === "vertical" && css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;

    button {
      margin: 10px 0;
    }
  `}
`

export function IntroButtons({ children, display = "horizontal" }) {
  return <ButtonsWrapper display={display}>
    <Link to={introductionHref}>
      <Button>What is Spectro Cloud?</Button>
    </Link>
    <Link target="_blank" to={demoHref}>Request Demo</Link>
  </ButtonsWrapper>
}
