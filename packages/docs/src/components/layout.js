import React from 'react';
import styled from 'styled-components';
import { MDXProvider } from '@mdx-js/react';

import ThemeProvider from './theme/Provider';
import mdxComponents from './mdxComponents';
import Sidebar from './sidebar';
import RightSidebar from './rightSidebar';
import Header from './Header';

const Wrapper = styled.div`
  display: flex;
  background: ${({ theme }) => theme.colors.background};

  .sideBarUL li a {
    color: ${({ theme }) => theme.colors.text};
  }

  .sideBarUL .item > a:hover {
    background-color: #1ed3c6;
    color: #fff !important;

    /* background: #F8F8F8 */
  }

  @media only screen and (max-width: 767px) {
    display: block;
  }
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
  margin-top: 80px;
`

const MainWrap = styled.div`
  position: relative;
  flex-grow: 1;
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
