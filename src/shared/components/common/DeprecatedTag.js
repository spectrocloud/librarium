import React from "react";
import styled from "styled-components";

const Wrapper = styled.span`
  background: #868683;
  color: #fff;
  padding: 4px 7px;
  border-radius: 4px;
  font-size: 12px;
`;

export default function DeprecatedTag({ ...props }) {
  return <Wrapper {...props}>deprecated</Wrapper>;
}
