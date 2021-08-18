import React from 'react';
import styled, { css } from 'styled-components';
import SidebarIcon from '../../../components/styles/SidebarIcon';
import { useLocation } from '@reach/router';
import Link from '../../../components/Link';

const MenuNode = styled.div`
  a {
    font-style: normal;
    font-size: 14px;
    line-height: 16px;
    color: #4a4b6a;
    :hover {
      color: #206cd1;
    }

    ${({ expanded, isActive }) => {
      return (
        expanded &&
        !isActive &&
        css`
          color: #206cd1;
        `
      );
    }}

    ${props =>
      props.level === 1 &&
      !props.isActive &&
      !props.expanded &&
      css`
        color: #9698a9;
        font-weight: 500;
      `}
  }
`;

const ChildrenItems = styled.div`
  .menu-link > div {
    padding-left: 68px;
  }
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

  ${props =>
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
  const location = useLocation();
  let isActive = false;
  const expanded = React.useMemo(() => {
    return (
      !url ||
      (location &&
        (location.pathname.startsWith(url) ||
          location.pathname.startsWith(config.gatsby.pathPrefix + url)) &&
        !!items.length)
    );
  }, [url]);

  if (url === '/' && location && location.pathname === '/') {
    isActive = false;
  }

  if (url === location?.pathname) isActive = true;

  if (hiddenFromNav) {
    return null;
  }
  const hasChildren = items.length !== 0;

  return (
    <MenuNode isActive={isActive} expanded={expanded} level={level}>
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
