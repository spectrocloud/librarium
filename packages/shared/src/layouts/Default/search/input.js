import React, { useRef, useEffect } from 'react';
import { connectSearchBox } from 'react-instantsearch-dom';

import styled, { css } from 'styled-components';
import { Search } from 'styled-icons/fa-solid/Search';

const SearchIcon = styled(Search)`
  width: 1em;
  pointer-events: none;
  margin-right: 10px;
  left: 15px;
  color: #999;
`;

const Input = styled.input`
  outline: none;
  border: none;
  font-size: 1em;
  background: white;
  transition: ${props => props.theme.shortTrans};
  border-radius: ${props => props.theme.smallBorderRadius};
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
  ${props =>
    props.center &&
    css`
      margin-left: 57px;
    `}
`;

export default connectSearchBox(({ refine, focus, center, ...rest }) => {
  const ref = useRef(null);
  const preventSubmit = e => {
    e.preventDefault();
  };

  useEffect(() => {
    if (focus) {
      ref.current.focus();
    }
  }, [focus]);

  return (
    <Form className={'formElement'} onSubmit={preventSubmit} center={center}>
      <SearchIcon />
      <Input
        ref={ref}
        className={'searchInput'}
        id="searchInputId"
        type="text"
        placeholder="Search"
        aria-label="Search"
        onChange={e => refine(e.target.value)}
        {...rest}
      />
    </Form>
  );
});
