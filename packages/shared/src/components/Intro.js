import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import background from "../assets/hero-background.png"
import Button from "./ui/Button";

//

const IntroWrapper = styled.div`
  background-image: url(${background});
  background-size: cover;
  padding: 43px;
`

export default function IntroSection({children}) {
  return <IntroWrapper>{children}</IntroWrapper>
}


const ButtonsWrapper = styled.div`
  margin: 16px -16px;
  button {
    margin: 0 16px;
  }
`

export function IntroButtons({children}) {
  return <ButtonsWrapper>
    <Button primary> <FontAwesomeIcon icon="play-circle"/> What is spectrocloud</Button>
    <Button>Request Demo</Button>
  </ButtonsWrapper>
}
