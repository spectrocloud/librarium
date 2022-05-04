import React, { useState } from "react";
import { useLocation } from "@reach/router";
import styled, { css } from "styled-components";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import Sidebar from "./sidebar";
import Header from "./Header";

import "@fortawesome/fontawesome-svg-core/styles.css";
import "./layout.css";

library.add(fas, fab);

const Wrapper = styled.div`
  display: flex;
  overflow: hidden;
  height: 100%;

  @media print {
    display: block;
    overflow: visible;
  }
`;

export const Content = styled.main`
  padding: 54px 60px;
  background: transparent;

  ${(props) =>
    props.fullWidth &&
    css`
      margin: 0;
    `}

  @media (max-width: 952px) {
    padding: 0;
  }
`;

const LeftSideBarWidth = styled.div`
  max-width: 323px;
  width: 100%;

  ${(props) =>
    props.hideMenuSidebar &&
    css`
      display: none;
    `}

  @media (max-width: 952px) {
    display: block;
    position: absolute;
    width: 0%;
    z-index: 20;
    overflow: hidden;
    bottom: 0;
    top: 0;

    ${(props) =>
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

  @media (max-width: 952px) {
    ${(props) =>
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
  background: linear-gradient(119.9deg, #ffffff 43.09%, #e8f1ff 107.76%, #ebf2ff 107.77%);
  ${(props) =>
    props.isHomepage &&
    css`
      background: #fff;
    `}
`;

export default function Layout({
  children,
  menu,
  fullWidth,
  subLogo,
  extraMenu,
  hideMenuSidebar = false,
}) {
  const [expanded, showNavbar] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <Wrapper>
      <>
        <Overlay expanded={expanded} onClick={() => showNavbar(false)} />
        <LeftSideBarWidth expanded={expanded} hideMenuSidebar={hideMenuSidebar}>
          <Sidebar menu={menu} subLogo={subLogo} extraMenu={extraMenu} />
        </LeftSideBarWidth>
      </>
      <MainWrap isHomepage={isHomePage}>
        <Header toggleMenu={() => showNavbar(!expanded)} />
        <Content fullWidth={fullWidth}>{children}</Content>
      </MainWrap>
    </Wrapper>
  );
}

export const ContentWrap = styled.div`
  margin: 0 46px;
`;

Layout.ContentWrap = ContentWrap;
