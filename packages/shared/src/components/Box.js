import React from "react";
import styled, { css } from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const config = {
  warning: {
    icon: "exclamation-triangle",
    color_rgb: "255, 204, 0",
  },
  info: {
    icon: "exclamation-circle",
    color_rgb: "77, 158, 240",
  }
}

const Wrapper = styled.div`
  display: flex;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 1em;
  ${props => props.type && css`
    background: rgba(${config[props.type].color_rgb}, 0.1);
    border: 1px solid rgba(${config[props.type].color_rgb}, 0.4);
  `}
`;

const ContentWrapper = styled.div`
  min-width: 0;
`

const IconWrapper = styled.div`
  margin-right: 10px;
`;

function Box({ children, type }) {
  return (
    <Wrapper type={type}>
      <IconWrapper><FontAwesomeIcon icon={config[type].icon} /></IconWrapper>
      <ContentWrapper>{children}</ContentWrapper>
    </Wrapper>
  );
}

export default Box;
