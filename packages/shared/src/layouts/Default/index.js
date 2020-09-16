import React, { useState } from 'react';
import styled, { css } from 'styled-components';

import Sidebar from './sidebar';
import Header from './Header';

import '@fortawesome/fontawesome-svg-core/styles.css';
import './layout.css';

const Wrapper = styled.div`
  display: flex;
  overflow: hidden;
  height: 100%;
`;

export const Content = styled.main`
  margin: 0px 43px;
  background: ${({ theme }) => theme.colors.background};

  ${props =>
    props.fullWidth &&
    css`
      margin: 0;
    `}
`;

const LeftSideBarWidth = styled.div`
  max-width: 323px;
  width: 100%;

  ${props =>
    props.hideMenuSidebar &&
    css`
      display: none;
    `}

  @media (max-width: 830px) {
    display: block;
    position: absolute;
    width: 0%;
    z-index: 20;
    overflow: hidden;
    bottom: 0;
    top: 0;

    ${props =>
      props.expanded &&
      css`
        width: 100%;
      `}
    transition: width 0.3s ease-out;
  }
`;

const Overlay = styled.div`
  display: none;
  opacity: 0;

  @media (max-width: 830px) {
    ${props =>
      props.expanded &&
      css`
        position: absolute;
        display: block;
        opacity: 1;
        width: 100%;
        height: 100%;
        z-index: 19;
        background-color: rgba(0, 0, 0, 0.4);
      `}
    transition: opacity 3s ease-out;
  }
`;

const MainWrap = styled.div`
  flex-grow: 1;
  overflow-y: auto;
`;

export default function Layout({
  children,
  location,
  menu,
  fullWidth,
  subLogo,
  extraMenu,
  hideMenuSidebar = false,
}) {
  const [expanded, showNavbar] = useState(false);

  return (
    <Wrapper>
      <>
        <Overlay expanded={expanded} onClick={() => showNavbar(false)} />
        <LeftSideBarWidth expanded={expanded} hideMenuSidebar={hideMenuSidebar}>
          <Sidebar location={location} menu={menu} subLogo={subLogo} extraMenu={extraMenu} />
        </LeftSideBarWidth>
      </>
      <MainWrap>
        <Header location={location} toggleMenu={() => showNavbar(!expanded)} />
        <Content fullWidth={fullWidth}>{children}</Content>
      </MainWrap>
    </Wrapper>
  );
}

export const ContentWrap = styled.div`
  margin: 0 46px;
`;

Layout.ContentWrap = ContentWrap;
