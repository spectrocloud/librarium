import React from "react";
import { Input } from "antd";
import styled from "styled-components";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Wrapper = styled.div`
  position: relative;

  .ant-input {
    height: 48px;
    padding-left: 54px;
    box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.2), 0px 2px 0px rgba(0, 0, 0, 0.03);
    border-radius: 4px;
  }

  .ant-input:placeholder-shown {
    font-size: 13px;
    color: #333;
    opacity: 0.5;
  }
`;

const SearchIcon = styled(FontAwesomeIcon)`
  color: #bbb;
  position: absolute;
  z-index: 10;
  left: 22px;
  top: 50%;
  transform: translateY(-50%);
`;

export default function IntegrationSearch({ onSearch }) {
  return (
    <Wrapper>
      <SearchIcon icon="search" />
      <Input placeholder="Search for integration..." onChange={(e) => onSearch(e.target.value)} />
    </Wrapper>
  );
}
