import React, { useRef, useState } from "react";
import { Input } from "antd";
import styled from "styled-components";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  height: 48px;
  padding: 0px 23px;
  box-shadow: 0px 0px 2px rgb(0 0 0 / 20%), 0px 2px 0px rgb(0 0 0 / 3%);
  border-radius: 4px;
  border: 1px solid #d9d9d900;
  transition: all 0.3s;

  .ant-input {
    padding-left: 17px;
    background: rgba(0, 0, 0, -0.9);
    border-color: rgba(0, 0, 0, -0.9);
    border-right-width: 0px !important;
    :focus {
      box-shadow: 0 0 0 0px rgb(0 0 0 / 0%);
    }
  }
  .ant-input:placeholder-shown {
    font-size: 13px;
    color: #333;
    opacity: 0.5;
  }
  :focus-within {
    border-color: #40a9ff8c;
    border-right-width: 1px !important;
    outline: 0;
    box-shadow: 1px 1px 1px 1px rgb(0 0 0 / 3%);
  }

  :hover {
    border-color: #40a9ff8c;
    border-right-width: 1px !important;
    box-shadow: 1px 1px 1px 1px rgb(0 0 0 / 3%);
  }
`;

const SearchIcon = styled(FontAwesomeIcon)`
  color: #bbb;
  z-index: 10;
`;

const ClearIcon = styled(SearchIcon)`
  :hover {
    cursor: pointer;
  }
`;

export default function IntegrationSearch({ onSearch }) {
  const [inputValue, setInputValue] = useState("");
  const ref = useRef(null);

  return (
    <Wrapper>
      <SearchIcon icon="search" />
      <Input
        ref={ref}
        placeholder="Search for integration..."
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          onSearch(e.target.value);
        }}
      />
      <ClearIcon
        icon="times"
        onClick={() => {
          setInputValue("");
          onSearch("");
          ref.current.focus();
        }}
      />
    </Wrapper>
  );
}
