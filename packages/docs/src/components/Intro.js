import React from "react";
import styled from "styled-components";
import background from "assets/hero-background.png"

const Wrapper = styled.div`
  background-image: url(${background});
`

export default function IntroSection({children}) {
return <Wrapper>{children}</Wrapper>
}
