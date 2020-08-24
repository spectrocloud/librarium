import React from 'react';
import { connectSearchBox } from 'react-instantsearch-dom';

import styled from 'styled-components';
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
  padding-left: 21px;
  @media only screen and (max-width: 767px) {
    width: 100%;
    margin-left: 21px;
  }
`;

export default connectSearchBox(({ refine, ...rest }) => {
  const preventSubmit = e => {
    e.preventDefault();
  };

  return (
    <Form className={'formElement'} onSubmit={preventSubmit}>
      <SearchIcon />
      <Input
        className={'searchInput '}
        type="text"
        placeholder="Search"
        aria-label="Search"
        onChange={e => refine(e.target.value)}
        {...rest}
      />
    </Form>
  );
});
