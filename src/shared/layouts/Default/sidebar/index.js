import React, { useEffect, useRef } from "react";
import Tree from "./tree";
import styled from "styled-components";
import Logo from "shared/components/Logo";
import Link from "shared/components/Link";
import { useSetupContext } from "shared/layouts/Persistent/provider";
import { DEFAULT_MENU } from "../../Default/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation } from "@reach/router";

const Sidebar = styled.aside`
  min-width: 314px;
  height: 100%;
  background: #ffffff;
`;

const MenuWrap = styled.div`
  padding: 50px 0;
`;

const LogoWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 14px 0;
  position: sticky;
  background: #ffffff;
  top: 0;
  border-bottom: 1px solid #dedfe5;
  strong {
    font-family: Rubik;
    font-style: normal;
    font-weight: normal;
    font-size: 17px;
    line-height: 18px;
    margin-left: 6px;
    color: linear-gradient(340.87deg, #206cd1 11.36%, #2681fa 88.9%);
  }
`;

const Content = styled.div`
  border-right: 1px solid #dedfe5;
  height: calc(100% - 81px);
  overflow-y: auto;
  @media (max-width: 952px) {
    padding-bottom: 72px;
  }
`;

const Navbar = styled.div`
  display: none;
  @media (max-width: 952px) {
    display: block;
    position: absolute;
    bottom: 0;
    background: #fff;
    border-top: 1px solid #dedfe5;
    height: 72px;
    display: flex;
    flex-direction: row-reverse;
    align-items: flex-end;
    justify-content: center;
    width: 100%;
    padding: 15.5px 0;
    .navbar {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    a {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 0 10px;
      color: #9698a9;
    }

    a.isActive,
    a:hover {
      color: #206cd1;
    }
  }
`;

const SidebarLayout = ({
  menu,
  extraMenu,
  logoLocation = "/",
  subLogo = (
    <path
      d="M272.484 23.8453C274.187 23.8453 275.675 24.1828 276.948 24.8579C278.222 25.5329 279.204 26.4841 279.894 27.7114C280.6 28.9234 280.952 30.3271 280.952 31.9227C280.952 33.5028 280.6 34.9066 279.894 36.1339C279.204 37.3612 278.214 38.3124 276.925 38.9875C275.652 39.6625 274.171 40 272.484 40H266.432V23.8453H272.484ZM272.231 36.5942C273.719 36.5942 274.877 36.1876 275.706 35.3745C276.534 34.5614 276.948 33.4108 276.948 31.9227C276.948 30.4345 276.534 29.2762 275.706 28.4478C274.877 27.6193 273.719 27.2051 272.231 27.2051H270.367V36.5942H272.231ZM293.323 40.1611C291.804 40.1611 290.408 39.8082 289.135 39.1025C287.877 38.3968 286.872 37.4149 286.12 36.1569C285.384 34.8836 285.016 33.4568 285.016 31.8766C285.016 30.2965 285.384 28.8774 286.12 27.6193C286.872 26.3613 287.877 25.3795 289.135 24.6738C290.408 23.9681 291.804 23.6152 293.323 23.6152C294.842 23.6152 296.23 23.9681 297.488 24.6738C298.762 25.3795 299.759 26.3613 300.48 27.6193C301.216 28.8774 301.584 30.2965 301.584 31.8766C301.584 33.4568 301.216 34.8836 300.48 36.1569C299.743 37.4149 298.746 38.3968 297.488 39.1025C296.23 39.8082 294.842 40.1611 293.323 40.1611ZM293.323 36.5712C294.612 36.5712 295.64 36.1416 296.407 35.2825C297.189 34.4233 297.58 33.2881 297.58 31.8766C297.58 30.4499 297.189 29.3146 296.407 28.4708C295.64 27.6117 294.612 27.1821 293.323 27.1821C292.019 27.1821 290.976 27.604 290.193 28.4478C289.426 29.2916 289.043 30.4345 289.043 31.8766C289.043 33.3034 289.426 34.4463 290.193 35.3055C290.976 36.1493 292.019 36.5712 293.323 36.5712ZM305.638 31.8996C305.638 30.3041 305.983 28.885 306.673 27.6424C307.364 26.3844 308.322 25.4102 309.55 24.7198C310.792 24.0141 312.196 23.6612 313.761 23.6612C315.679 23.6612 317.32 24.1675 318.686 25.18C320.051 26.1926 320.964 27.5733 321.424 29.3223H317.098C316.776 28.6472 316.315 28.1333 315.717 27.7804C315.134 27.4276 314.467 27.2511 313.715 27.2511C312.503 27.2511 311.521 27.673 310.769 28.5168C310.018 29.3606 309.642 30.4882 309.642 31.8996C309.642 33.3111 310.018 34.4387 310.769 35.2825C311.521 36.1263 312.503 36.5481 313.715 36.5481C314.467 36.5481 315.134 36.3717 315.717 36.0189C316.315 35.666 316.776 35.1521 317.098 34.477H321.424C320.964 36.226 320.051 37.6067 318.686 38.6193C317.32 39.6165 315.679 40.1151 313.761 40.1151C312.196 40.1151 310.792 39.7699 309.55 39.0795C308.322 38.3738 307.364 37.3996 306.673 36.1569C305.983 34.9143 305.638 33.4952 305.638 31.8996ZM332.211 40.1611C331.029 40.1611 329.971 39.9693 329.035 39.5858C328.099 39.2022 327.347 38.6346 326.78 37.8829C326.227 37.1311 325.936 36.226 325.905 35.1674H330.093C330.155 35.7657 330.362 36.226 330.715 36.5481C331.068 36.855 331.528 37.0084 332.095 37.0084C332.678 37.0084 333.139 36.878 333.476 36.6172C333.814 36.341 333.982 35.9652 333.982 35.4896C333.982 35.0907 333.844 34.7609 333.568 34.5C333.307 34.2392 332.978 34.0245 332.579 33.8557C332.195 33.6869 331.643 33.4952 330.922 33.2804C329.879 32.9582 329.027 32.636 328.367 32.3139C327.708 31.9917 327.14 31.5161 326.665 30.8871C326.189 30.2581 325.951 29.4373 325.951 28.4248C325.951 26.9213 326.496 25.7477 327.585 24.9039C328.674 24.0448 330.093 23.6152 331.842 23.6152C333.622 23.6152 335.056 24.0448 336.146 24.9039C337.235 25.7477 337.818 26.929 337.895 28.4478H333.637C333.607 27.9262 333.415 27.5196 333.062 27.2281C332.709 26.9213 332.257 26.7679 331.704 26.7679C331.229 26.7679 330.845 26.8983 330.554 27.1591C330.262 27.4046 330.116 27.7651 330.116 28.2407C330.116 28.7623 330.362 29.1688 330.853 29.4603C331.344 29.7518 332.111 30.0663 333.154 30.4038C334.197 30.7567 335.041 31.0942 335.685 31.4164C336.345 31.7386 336.913 32.2065 337.388 32.8201C337.864 33.4338 338.102 34.2239 338.102 35.1904C338.102 36.1109 337.864 36.947 337.388 37.6988C336.928 38.4505 336.253 39.0488 335.363 39.4937C334.473 39.9386 333.423 40.1611 332.211 40.1611Z"
      fill="#3575CF"
    />
  ),
}) => {
  const [state, dispatch] = useSetupContext();
  const contentRef = useRef(null);
  const location = useLocation();
  function renderMenuItem({ link, title, icon, isActive = () => false }, index) {
    return (
      <Link key={index} className={isActive(location) ? "navbar isActive" : "navbar"} to={link}>
        {icon && <FontAwesomeIcon icon={["fas", icon]} />}
        {title}
      </Link>
    );
  }

  useEffect(() => {
    contentRef.current.scrollTop = state.prevScrollPosition;
  }, [state.prevScrollPosition]);

  useEffect(() => {
    return () => {
      const scrollPosition = contentRef.current.scrollTop;
      dispatch({ type: "SET_PREVIOUS_SCROLL_POSITION", value: scrollPosition });
    };
  }, []);

  return (
    <Sidebar>
      <LogoWrap>
        <Link to={logoLocation}>
          <Logo>{subLogo}</Logo>
        </Link>
      </LogoWrap>
      <Content ref={contentRef}>
        <MenuWrap>
          <Tree menu={menu} />
        </MenuWrap>
        {extraMenu}
      </Content>
      <Navbar>{DEFAULT_MENU.map(renderMenuItem)}</Navbar>
    </Sidebar>
  );
};

export default SidebarLayout;
