import React from 'react';
import styled from 'styled-components';
import { StaticQuery, graphql } from 'gatsby';
import GitHubButton from 'react-github-btn';
import Link from './link';
import Loadable from 'react-loadable';

import config from '../../config.js';
import LoadingProvider from './mdxComponents/loading';
import { DarkModeSwitch } from './DarkModeSwitch';

const help = require('./images/help.svg');

const isSearchEnabled = config.header.search && config.header.search.enabled ? true : false;

let searchIndices = [];

if (isSearchEnabled && config.header.search.indexName) {
  searchIndices.push({
    name: `${config.header.search.indexName}`,
    title: `Results`,
    hitComp: `PageHit`,
  });
}

const SearchComponent = Loadable({
  loader: () => import('./search/index'),
  loading: LoadingProvider,
});

const Wrap = styled.div`
  height: 80px;
  box-shadow: inset 0px -1px 0px #F2F2F2;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1;
  background-color: #fff;

`


const Header = ({ location }) => (
  <StaticQuery
    query={graphql`
      query headerTitleQuery {
        site {
          siteMetadata {
            headerTitle
            githubUrl
            helpUrl
            tweetText
            logo {
              link
              image
            }
          }
        }
      }
    `}
    render={data => {
      const {
        site: {
          siteMetadata: { githubUrl },
        },
      } = data;

      return (
        <Wrap>
          <SearchComponent />
          <GitHubButton href={githubUrl} data-show-count="true" aria-label="Star on GitHub">
            Star
          </GitHubButton>
        </Wrap>
      );
    }}
  />
);

export default Header;
