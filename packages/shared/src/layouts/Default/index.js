import React from "react";
import styled from "styled-components";

import Sidebar from "./sidebar";
import Header from "./Header";

import "./layout.css";

// Move this in shared
// with sidebar and header

const Wrapper = styled.div`
  display: flex;
  overflow: hidden;
  height: 100%;
`;

const Content = styled.main`
  display: flex;
  flex-grow: 1;
  margin: 0px 88px;
  padding-top: 3rem;
  background: ${({ theme }) => theme.colors.background};

  table tr {
    background: ${({ theme }) => theme.colors.background};
  }

  @media only screen and (max-width: 1023px) {
    padding-left: 0;
    margin: 0 10px;
    padding-top: 3rem;
  }
`;

const MaxWidth = styled.div`
  @media only screen and (max-width: 50rem) {
    width: 100%;
    position: relative;
  }
`;

const LeftSideBarWidth = styled.div`
  width: 323px;
`;

const RightSideBarWidth = styled.div`
  width: 224px;
`;

const ContentWrap = styled.div`
  display: flex;
`;

const MainWrap = styled.div`
  flex-grow: 1;
  overflow-y: auto;
`;

export default function Layout({ children, location, menu }) {
  return (
    <Wrapper>
      <LeftSideBarWidth className={"hiddenMobile"}>
        <Sidebar location={location} menu={menu}/>
      </LeftSideBarWidth>
      <MainWrap>
        <Header location={location} />
        <ContentWrap>
          <Content>
            <MaxWidth>{children}</MaxWidth>
          </Content>
        </ContentWrap>
      </MainWrap>
    </Wrapper>
  );
}
