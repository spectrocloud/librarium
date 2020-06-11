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

  table {
    margin: 24px 0;
    width: 100%;
    text-align: left;
    border-radius: 4px 4px 0 0;
    border-collapse: separate;
    border-spacing: 0;

    thead > tr {
      background: #fafafa;
      box-shadow: 0px 1px 0px #ddd;
    }

    th {
      padding: 16px;
      font-weight: 500;
      font-size: 12px;
      line-height: 18px;
      letter-spacing: 0.02em;
      text-transform: capitalize;
      color: #777;
    }

    th:first-child {
      border-top-left-radius: 4px;
    }
    th:last-child {
      border-top-right-radius: 4px;
    }

    tbody > tr {
      box-shadow: 0px 1px 0px #f2f2f2;
    }

    tbody > tr > td {
      padding: 16px;
      font-size: 12px;
      line-height: 20px;
      letter-spacing: 0.02em;
      color: #555;
      vertical-align: top;
    }
  }

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
