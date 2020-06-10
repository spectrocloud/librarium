import React from 'react';
import styled from 'styled-components';
import Loadable from 'react-loadable';

import Loader from "../../components/Loader";

const SearchComponent = Loadable({
  loader: () => import('./search/index'),
  loading: Loader,
});

const Wrap = styled.div`
  height: 80px;
  box-shadow: inset 0px -1px 0px #f2f2f2;
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 1;
  background-color: #fff;
  display: flex;
  justify-content: space-between;

`;

const NavWrap = styled.div`
  a {
    padding: 0 10px;
    margin: 0 20px;
    color: #78909C;
    font-size: 14px;
    text-transform: uppercase;
    line-height: 80px;
    display: inline-block;

    &.isActive {
      color: #4432F5;
      box-shadow: inset 0px -1px 0px #4432F5;
    }
  }
`

const defaultMenu = [
  {
    title: "Docs",
    link: process.env.GATSBY_DOCS_URL,
    isActive() {return true}
  }, {
    title: "API",
    link: process.env.GATSBY_API_URL,
  }, {
    title: "Glossary",
    link: process.env.GATSBY_GLOSSARY_URL,
  }
]

export default function Header({menu = defaultMenu}) {
  function renderMenuItem({link, title, isActive = () =>  false}) {
    return <a target="_blank" className={isActive() ? "isActive" : ""} href={link}>{title}</a>
  }

  return (
    <Wrap>
      <SearchComponent />
      <NavWrap>
        {menu.map(renderMenuItem)}
      </NavWrap>
    </Wrap>
  );
}
