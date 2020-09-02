import React from 'react';
import styled, { css } from 'styled-components';
import SidebarIcon from "../../../components/styles/SidebarIcon";
import { useLocation } from "@reach/router"
import Link from "../../../components/Link";

const MenuNode = styled.div`
  color: #78909c;
  margin: 20px 0;

  > a, a:hover {
    text-decoration: none;
    color: #78909C;
    font-weight: 500;
  }

  ${props => props.isActive && css`
    > .menu-link {
      color: #4432F5;

      &:hover {
        color: #4432F5;
      }
    }
  `}
`;

const ChildrenItems = styled.div`
  margin: 10px 0 10px 26px;

  ${MenuNode} {
    margin: 10px 0;

    > a {
      font-weight: normal;
    }
  }
`;

const IconWrapper = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  margin-bottom: 2px;

  svg {
    stroke-width: 0;
    fill: #78909C;
    stroke: #78909C;
  }

  ${props => props.isActive && css`
    svg {
        fill: #4432F5;
        stroke: #4432F5;
      }
  `}
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
`;

const TreeNode = ({ url, title, items = [], icon, hiddenFromNav, config = { gatsby: {} } }) => {
  const [isActive, setIsActive] = React.useState();
  const location = useLocation();

  const expanded = React.useMemo(() => {
    return !url || location && (location.pathname.startsWith(url) || location.pathname.startsWith(config.gatsby.pathPrefix + url));
  }, [url])

  React.useEffect(() => {
    if (expanded) {
      setIsActive(true)
    }
    
    if (url === '/' && location && location.pathname === "/") {
      setIsActive(false)
      
    }
  }, [])
  
  
  if (hiddenFromNav) {
    return null;
  }
  const hasChildren = items.length !== 0;
  
  return (
    <MenuNode isActive={isActive}>
      {title && (
        <Link to={url} className="menu-link">
          <MenuItem>
            {icon && <IconWrapper isActive={isActive}><SidebarIcon type={icon} /></IconWrapper>}
            {title}
          </MenuItem>
        </Link>
      )}
      {expanded && hasChildren ? (
        <ChildrenItems>
          {items.map((item, index) => (
            <TreeNode
              key={item.url + index.toString()}
              {...item}
            />
          ))}
        </ChildrenItems>
      ) : null}
    </MenuNode>
  );
};

export default TreeNode;
