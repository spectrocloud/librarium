import React from 'react';
import styled from 'styled-components';
import Loadable from 'react-loadable';

import LoadingProvider from './mdxComponents/loading';

const SearchComponent = Loadable({
  loader: () => import('./search/index'),
  loading: LoadingProvider,
});

const Wrap = styled.div`
  height: 80px;
  box-shadow: inset 0px -1px 0px #f2f2f2;
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 1;
  background-color: #fff;
`;

export default function Header() {
  return (
    <Wrap>
      <SearchComponent />
    </Wrap>
  );
}
