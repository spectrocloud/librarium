import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import Loadable from 'react-loadable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Loader from '../../components/Loader';
import Link from '../../components/Link';
import { useConfig } from '../../config';
import { useLocation } from '@reach/router';
import { Search } from 'styled-icons/fa-solid/Search';
import logo from '../../assets/logo_landscape_for_white.png';

const SearchComponent = Loadable({
  loader: () => import('./search/index'),
  loading: Loader,
});

const MaxWidth = styled.div`
  margin: 0 auto;
  max-width: 1227px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  align-items: center;
  ${props =>
    !props.isHomePage &&
    css`
      max-width: 100%;
    `}
`;

const Wrap = styled.div`
  height: 80px;
  border-bottom: 1px solid #dedfe5;
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 10;
  background-color: #fff;

  .hamburger {
    display: none;
  }

  @media (max-width: 952px) {
    flex-direction: row-reverse;
    padding: 0 20px;
    .formElement {
      margin-left: 5px;
      border: 0;
    }
    .hamburger {
      display: block;
      margin: 0 20px;
      cursor: pointer;
      color: #999;
      font-size: 20px;
      &:hover {
        color: #206cd1;
      }
    }
  }
`;

const SearchIcon = styled(Search)`
  display: none;
  width: 1em;
  margin-right: 10px;
  left: 15px;
  color: #999;

  @media (max-width: 952px) {
    display: block;
    cursor: pointer;
    &:hover {
      color: #206cd1;
    }
  }
`;

const NavWrap = styled.div`
  margin-right: 54px;
  a {
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 16px;
    color: #252b53;
    padding: 5px 0;
    margin-left: 36px;

    &.isActive,
    &:hover {
      color: #206cd1;
      border-bottom: 2px solid #206cd1;
    }

    @media (max-width: 952px) {
      display: none;
    }
  }
`;

const BackButton = styled.div`
  margin-right: 20px;
  cursor: pointer;
  display: none;
`;

const LogoWrap = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  margin-left: 54px;

  @media (max-width: 952px) {
    display: none;
  }
`;

const Logo = styled.img`
  height: 36px;
`;

const SearchWrap = styled.div`
  @media (max-width: 952px) {
    display: none;

    ${props =>
      props.expanded &&
      css`
        display: flex;
        align-items: center;
        width: 100%;
        ${BackButton} {
          display: block;
        }
      `}
  }
`;

function isMenuActive(location, link) {
  return location.pathname.startsWith(link);
}

export const DEFAULT_MENU = [
  {
    title: 'Docs',
    link: '/',
    icon: 'folder',
    isActive(location) {
      const othersAreActive = DEFAULT_MENU.filter(item => item.title !== 'Docs').some(item => {
        return item.isActive && item.isActive(location);
      });

      return !othersAreActive;
    },
  },
  {
    title: 'API',
    link: '/api/',
    icon: 'cog',
    isActive(location) {
      return isMenuActive(location, '/api');
    },
  },
  {
    title: 'Back to Spectro Cloud',
    link: 'https://console.spectrocloud.com',
  },
];

export default function Header({ menu = DEFAULT_MENU, toggleMenu }) {
  const [expanded, expandSearchConsole] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  function renderMenuItem({ link, title, isActive = () => false }) {
    return (
      <Link key={title} className={isActive(location) ? 'isActive' : ''} to={link}>
        {title}
      </Link>
    );
  }

  const config = useConfig();

  return (
    <Wrap>
      <MaxWidth isHomePage={isHomePage}>
        {isHomePage && (
          <LogoWrap>
            <Logo src={logo} />
          </LogoWrap>
        )}
        <SearchWrap expanded={expanded}>
          <BackButton>
            <FontAwesomeIcon icon="chevron-left" onClick={() => expandSearchConsole(false)} />
          </BackButton>
          <SearchComponent config={config} focusInput={expanded} />
        </SearchWrap>
        {!expanded && (
          <>
            <SearchIcon onClick={() => expandSearchConsole(!expanded)} />
            <NavWrap>{menu.map(renderMenuItem)}</NavWrap>
            <FontAwesomeIcon icon="bars" onClick={toggleMenu} className="hamburger" />
          </>
        )}
      </MaxWidth>
    </Wrap>
  );
}
