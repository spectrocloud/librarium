import React, { useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import SidebarIcon from "shared/components/styles/SidebarIcon";
import { useLocation } from "@reach/router";
import { useSetupContext } from "shared/layouts/Persistent/provider";
import Link from "shared/components/Link";

const ChildrenItems = styled.div``;

const MenuNode = styled.div`
  a {
    font-style: normal;
    font-size: 14px;
    line-height: 16px;
    color: #4a4b6a;
    :hover {
      color: #206cd1;
    }

    ${(props) =>
      props.level === 1 &&
      !props.isActive &&
      !props.expanded &&
      css`
        color: #9698a9;
        font-weight: 500;
      `}
  }

  > a {
    ${({ expanded }) => {
      return (
        expanded &&
        css`
          color: #206cd1;
          svg {
            fill: #206cd1;
            stroke: #206cd1;
          }
        `
      );
    }}
  }

  ${(props) => css`
    &[data-level="${props.level}"] > .menu-link > div {
      padding-left: ${(props) => props.level * 34 + 20}px;
    }

    &[data-level="2"] {
      position: relative;
      &:before {
        position: absolute;
        content: "";
        height: 100%;
        top: 0;
        left: 64px;
        border-left: 1px solid #ddd;
      }
    }
  `}
`;

const IconWrapper = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  color: #aeb1be;
  svg {
    stroke-width: 0;
    fill: #aeb1be;
    stroke: #aeb1be;
  }

  ${(props) =>
    props.isActive &&
    css`
      color: #206cd1;
      svg {
        fill: #206cd1;
        stroke: #206cd1;
      }
    `}
`;

const MenuItem = styled.div`
  display: flex;
  padding: 12px 0px 12px 32px;
  align-items: center;
  :hover {
    color: #206cd1;
  }

  ${({ isActive }) => {
    return (
      isActive &&
      css`
        background: linear-gradient(0deg, rgba(255, 255, 255, 0.93), rgba(255, 255, 255, 0.93)),
          #206cd1;
        font-weight: 600;
        color: #206cd1;
        border-right: 5px solid #206cd1;
      `
    );
  }}
`;

const TreeNode = ({
  url,
  title,
  items = [],
  icon,
  hiddenFromNav,
  config = { gatsby: {} },
  level = 0,
}) => {
  let isActive = false;
  const nodeRef = useRef(null);
  const location = useLocation();
  const [state, dispatch] = useSetupContext();
  const isVisited = state.visitedRoutes.find((route) => route === url);
  const hasChildren = items.length !== 0;
  const expanded = React.useMemo(() => {
    return (
      !url ||
      isVisited ||
      (location &&
        (location.pathname.startsWith(url) ||
          location.pathname.startsWith(config.gatsby.pathPrefix + url)) &&
        !!items.length)
    );
  }, [url]);

  useEffect(() => {
    if (hasChildren && !isVisited && expanded) {
      dispatch({ type: "ADD_VISITED_ROUTE", value: url });
    }
  }, []);

  useEffect(() => {
    if (!nodeRef.current) return;
    if (!isActive) return;
    nodeRef.current.scrollIntoView({
      behavior: "instant",
      block: "center",
    });
  }, [isActive, nodeRef]);

  if (url === "/" && location && location.pathname === "/") {
    isActive = false;
  }

  if (url === location?.pathname) isActive = true;

  if (hiddenFromNav) {
    return null;
  }

  return (
    <MenuNode
      isActive={isActive}
      expanded={expanded}
      level={level}
      data-level={level}
      ref={nodeRef}
    >
      {title && (
        <Link to={url} className="menu-link">
          <MenuItem isActive={isActive}>
            {icon && (
              <IconWrapper isActive={isActive}>
                <SidebarIcon type={icon} />
              </IconWrapper>
            )}
            {title}
          </MenuItem>
        </Link>
      )}
      {expanded && hasChildren && (
        <ChildrenItems>
          {items.map((item, index) => (
            <TreeNode key={item.url + index.toString()} {...item} level={level + 1} />
          ))}
        </ChildrenItems>
      )}
    </MenuNode>
  );
};

export default TreeNode;
