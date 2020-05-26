import React from "react";
import styled from "styled-components";
import Button from "components/ui/Button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Wrapper = styled.div`
  margin: 16px -16px;
  button {
    margin: 0 16px;
  }
`

export default function IntroButtons({children}) {
  return <Wrapper>
    <Button primary> <FontAwesomeIcon icon="play-circle"/> What is spectrocloud</Button>
    <Button>Request Demo</Button>
  </Wrapper>
}
