import React from 'react';
import Tree from './tree';
import { StaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';
import { ExternalLink } from 'react-feather';
import config from '../../../config';
import menuBackground from "assets/menu-background.png"

// eslint-disable-next-line no-unused-vars
const ListItem = styled(({ className, active, level, ...props }) => {
  return (
      <a href={props.to} {...props} target="_blank" rel="noopener noreferrer">
        {props.children}
      </a>
  );
})`
  list-style: none;


  a {
    color: #5c6975;
    text-decoration: none;
    font-weight: ${({ level }) => (level === 0 ? 700 : 400)};
    padding: 0.45rem 0 0.45rem ${props => 2 + (props.level || 0) * 1}rem;
    display: block;
    position: relative;

    ${props =>
      props.active &&
      `
      // color: #663399;
      border-color: rgb(230,236,241) !important;
      border-style: solid none solid solid;
      border-width: 1px 0px 1px 1px;
      background-color: #fff;
    `} // external link icon
    svg {
      float: right;
      margin-right: 1rem;
    }
  }
`;

const Sidebar = styled.aside`
  width: 323px;
  position: fixed;
  top: 0;
  left: 0;
  overflow-y: auto;
  height: 100%;
  background: url(${menuBackground}), linear-gradient(127.94deg, #F9F9F9 51.53%, #F5F5F5 72.26%);


  @media only screen and (max-width: 1023px) {
    width: 100%;
    /* position: relative; */
    height: 100vh;
  }

  @media (min-width: 767px) and (max-width: 1023px) {
    padding-left: 0;
  }

  @media only screen and (max-width: 767px) {
    padding-left: 0px;
    height: auto;
  }
`;

const SidebarLayout = ({ location }) => (
  <StaticQuery
    query={graphql`
      query {
        allMdx {
          edges {
            node {
              fields {
                slug
                title
              }
            }
          }
        }
      }
    `}
    render={({ allMdx }) => {
      return (
        <Sidebar>
          {config.sidebar.title ? (
            <div
              className={'sidebarTitle hiddenMobile'}
              dangerouslySetInnerHTML={{ __html: config.sidebar.title }}
            />
          ) : null}
            <Tree edges={allMdx.edges} />
            {config.sidebar.links.map((link, key) => {
              if (link.link !== '' && link.text !== '') {
                return (
                  <ListItem key={key} to={link.link}>
                    {link.text}
                    <ExternalLink size={14} />
                  </ListItem>
                );
              }
            })}
        </Sidebar>
      );
    }}
  />
);

export default SidebarLayout;
