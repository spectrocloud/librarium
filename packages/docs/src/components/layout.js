import React from 'react';
import styled from 'styled-components';
import { MDXProvider } from '@mdx-js/react';

import ThemeProvider from './theme/Provider';
import mdxComponents from './mdxComponents';
import Sidebar from './sidebar';
import RightSidebar from './rightSidebar';
import Header from './Header';

import "./styles.css"


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
`

const MainWrap = styled.div`
  flex-grow: 1;
  overflow-y: auto;
`

const Layout = ({ children, location }) => (
  <ThemeProvider location={location}>
    <MDXProvider components={mdxComponents}>
      <Wrapper>
        <LeftSideBarWidth className={'hiddenMobile'}>
          <Sidebar location={location} />
        </LeftSideBarWidth>
        <MainWrap>
          <Header location={location} />
          <ContentWrap>
            <Content>
              <MaxWidth>{children}</MaxWidth>
            </Content>
            <RightSideBarWidth className={'hiddenMobile'}>
              <RightSidebar location={location} />
            </RightSideBarWidth>
          </ContentWrap>
        </MainWrap>
      </Wrapper>
    </MDXProvider>
  </ThemeProvider>
);

export default Layout;
