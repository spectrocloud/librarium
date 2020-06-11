import React from "react";
import styled, { css } from "styled-components";

import Sidebar from "./sidebar";
import Header from "./Header";

import "./layout.css";

const Wrapper = styled.div`
  display: flex;
  overflow: hidden;
  height: 100%;
`;

const Content = styled.main`
  margin: 0px 43px;
  background: ${({ theme }) => theme.colors.background};

  ${(props) =>
    props.fullWidth &&
    css`
      margin: 0;
    `}
`;

const LeftSideBarWidth = styled.div`
  max-width: 323px;
  width: 100%;
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
}) {
  return (
    <Wrapper>
      <LeftSideBarWidth className={"hiddenMobile"}>
        <Sidebar
          location={location}
          menu={menu}
          subLogo={subLogo}
          extraMenu={extraMenu}
        />
      </LeftSideBarWidth>
      <MainWrap>
        <Header location={location} />
        <Content fullWidth={fullWidth}>{children}</Content>
      </MainWrap>
    </Wrapper>
  );
}

export const ContentWrap = styled.div`
  margin: 0 46px;
`;

Layout.ContentWrap = ContentWrap;
