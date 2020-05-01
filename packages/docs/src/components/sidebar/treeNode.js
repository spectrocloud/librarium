import React from 'react';
import styled, { css } from 'styled-components';

import config from '../../../config';
import Link from '../link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const MenuNode = styled.div`
  color: #78909c;
  margin: 20px 0;

  .svg-inline--fa {
    margin-right: 10px;
  }
  ${props => props.active && css`
    > a {
      color: #4432F5;
    }
  `}
`;

const ChildrenItems = styled.div`
  margin: 10px 0 10px 26px;

  ${MenuNode} {
    margin: 10px 0;
  }
`;

const TreeNode = ({ setCollapsed, collapsed, url, title, items, icon }) => {
  const hasChildren = items.length !== 0;

  let location;

  if (typeof document != 'undefined') {
    location = document.location;
  }
  const isActive =
    !url || location && (location.pathname.startsWith(url) || location.pathname.startsWith(config.gatsby.pathPrefix + url));

  return (
    <MenuNode active={isActive}>
      {title && (
        <Link to={url}>
          {icon && <FontAwesomeIcon icon={icon} />}
          {title}
        </Link>
      )}
      {isActive && hasChildren ? (
        <ChildrenItems>
          {items.map((item, index) => (
            <TreeNode
              key={item.url + index.toString()}
              setCollapsed={setCollapsed}
              collapsed={collapsed}
              {...item}
            />
          ))}
        </ChildrenItems>
      ) : null}
    </MenuNode>
  );
};

export default TreeNode;
