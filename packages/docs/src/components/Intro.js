import React from "react";
import styled from "styled-components";
import background from "assets/hero-background.png"

const Wrapper = styled.div`
  background-image: url(${background});
  background-size: cover;
  padding: 43px;
`

export default function IntroSection({children}) {
  return <Wrapper>{children}</Wrapper>
}
