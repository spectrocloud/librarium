import React, { useRef, useEffect, useState } from "react";
import { useURLQuery } from "shared/utils/location";
import { connectSearchBox } from "react-instantsearch-dom";

import styled, { css } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { debounce } from "lodash";

const SearchIcon = styled(FontAwesomeIcon)`
  width: 1em;
  pointer-events: none;
  margin-right: 10px;
  left: 15px;
  color: #999;
`;
const ClearIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
`;

const Input = styled.input`
  outline: none;
  border: none;
  font-size: 1em;
  background: white;
  transition: 1s all ease-in-out;
  border-radius: 3px;
  flex-grow: 1;

  ::placeholder {
    color: #999;
  }
`;

const Form = styled.form`
  display: flex;
  align-items: center;
  flex-grow: 1;
  border: 1px solid #9698a9;
  border-radius: 7px;
  padding: 11.5px 18px;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  color: #9698a9;
  min-width: 295px;
  ${(props) =>
    props.center &&
    css`
      margin-left: 57px;
    `}
`;

const gaSearchDebounced = debounce((query) => {
  if (!window.ga) {
    return;
  }
  window.ga("set", "page", `/?q=${query}`);
  window.ga("send", "pageView", `/?q=${query}`);
}, 3000);

export default connectSearchBox(({ refine, focus, center, ...rest }) => {
  const ref = useRef(null);
  const preventSubmit = (e) => {
    e.preventDefault();
  };

  const { term = "" } = useURLQuery();
  const [inputValue, setInputValue] = useState(term);

  useEffect(() => {
    if (focus) {
      ref.current.focus();
    }
  }, [focus]);

  useEffect(() => {
    if (!inputValue) {
      return;
    }
    gaSearchDebounced(inputValue);
  }, [inputValue]);

  return (
    <Form className="formElement" onSubmit={preventSubmit} center={center}>
      <SearchIcon icon="search" />
      <Input
        ref={ref}
        className="searchInput"
        id="searchInputId"
        type="text"
        value={inputValue}
        placeholder="Search"
        aria-label="Search"
        onChange={(e) => {
          setInputValue(e.target.value);
          refine(e.target.value);
        }}
        {...rest}
      />
      <ClearIcon
        icon="times"
        onClick={() => {
          setInputValue("");
          ref.current.focus();
        }}
      />
    </Form>
  );
});
