import React from 'react';
import styled, { css } from 'styled-components';
import Loadable from 'react-loadable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Loader from '../../components/Loader';
import Link from '../../components/Link';
import { useConfig } from '../../config';

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
  z-index: 10;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
`;

const NavWrap = styled.div`
  margin-right: 20px;

  a {
    padding: 0 10px;
    margin: 0 20px;
    color: #78909c;
    font-size: 14px;
    text-transform: uppercase;
    line-height: 80px;
    display: inline-block;

    &.isActive {
      color: #4432f5;
      box-shadow: inset 0px -1px 0px #4432f5;
    }

    @media (max-width: 830px) {
      display: none;
    }
  }
`;

const MobileNav = styled.div`
  display: none;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 0px 43px;
  svg {
    cursor: pointer;
    color: #206cd1;
    font-size: 20px;
  }
  @media (max-width: 830px) {
    display: flex;
  }
`;

function isMenuActive(location, link) {
  return location.pathname.startsWith(link);
}

const DEFAULT_MENU = [
  {
    title: 'Docs',
    link: '/',
    isActive(location) {
      const othersAreActive = DEFAULT_MENU.filter(item => item.title !== 'Docs').some(item => {
        return item.isActive(location);
      });

      return !othersAreActive;
    },
  },
  {
    title: 'API',
    link: '/api/',
    isActive(location) {
      return isMenuActive(location, '/api');
    },
  },
];

export default function Header({ menu = DEFAULT_MENU, location, toggleMenu }) {
  function renderMenuItem({ link, title, isActive = () => false }) {
    return (
      <Link className={isActive(location) ? 'isActive' : ''} to={link}>
        {title}
      </Link>
    );
  }

  const config = useConfig();

  return (
    <Wrap>
      <SearchComponent config={config} />
      <NavWrap>{menu.map(renderMenuItem)}</NavWrap>
      <MobileNav>
        <FontAwesomeIcon icon="bars" onClick={toggleMenu} />
        <FontAwesomeIcon icon="search" /> {/*maybe?*/}
      </MobileNav>
    </Wrap>
  );
}
