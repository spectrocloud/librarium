import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

const Algolia = styled.a`
  color: #1890ff;
  :hover {
    color: #1890ff;
  }
`;

export const PoweredBy = () => (
  <span className="poweredBy">
    Powered by{` `}
    <Algolia href="https://algolia.com">
      <FontAwesomeIcon icon={["fab", "algolia"]} /> Algolia
    </Algolia>
  </span>
);
