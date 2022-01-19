import React from 'react';
import styled, { css } from 'styled-components';

// TODO clean up these styles
export const Sidebar = styled.aside`
  overflow: auto;
  background: transparent;

  .rightSideTitle {
    font-size: 10px;
    line-height: 1;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.2px;
    padding: 7px 24px 7px 16px;

    color: #666A80;
  }

  .rightSideBarUL {
    margin-top: 32px;
    padding: 0;
    border-left: 1px solid #e6ecf1;
  }

  @media (max-width: 1100px) {
    display: none;
  }
`;

const ListItemWrap = styled.li`
  list-style-type: none;

  a {
    text-decoration: none;
    font-weight: ${({ level }) => (level === 0 ? 700 : 400)};
    padding: 0.45rem 0 0.45rem ${props => 2 + (props.level || 0) * 1}rem;
    display: block;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    color: #9698a9;
    padding: 7px 24px 7px 16px;

    ${props =>
      props.isActive &&
      css`
        color: #206cd1;
      `};

    :hover {
      color: #206cd1 !important;
    }
  }
`;

export const ListItem = ({ className, level, active, ...props }) => {
  return (
    <ListItemWrap className={className} isActive={active} {...props}>
      <a href={props.to}>{props.children}</a>
    </ListItemWrap>
  );
};
