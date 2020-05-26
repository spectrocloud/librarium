import React from "react";
import styled, {css} from "styled-components";

const StyledButton = styled.button`
  background-color: #FFFFFF;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.1), inset 0px -1px 0px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  line-height: 20px;
  padding: 8px 16px;
  border: none;
  color: #78909C;
  font-size: 16px;

  ${props => props.primary && css`
    background-color: #4432F5;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2), inset 0px -2px 0px rgba(0, 0, 0, 0.2);
    color: #fff;
  `}

`

export default function Button(props) {
  return <StyledButton {...props} />
}
