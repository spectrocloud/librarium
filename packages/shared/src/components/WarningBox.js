import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Wrapper = styled.div`
  display: flex;
  padding: 10px;
  background: rgba(255, 204, 0, 0.1);
  border: 1px solid rgba(255, 204, 0, 0.4);
  border-radius: 4px;
  margin-bottom: 1em;
`;

const IconWrapper = styled.div`
  margin-right: 5px;
`;

function WarningBox({ children }) {
  return (
    <Wrapper>
      <IconWrapper><FontAwesomeIcon icon="exclamation-triangle" /></IconWrapper>
      <div>{children}</div>
    </Wrapper>
  );
}

export default WarningBox;
