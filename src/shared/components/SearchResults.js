import React from "react";
import styled from "styled-components";

import { Link } from "gatsby";
import {
  Configure,
  Hits,
  Index,
  InstantSearch,
  Highlight,
  Snippet,
  connectSearchBox,
} from "react-instantsearch-dom";
import algoliasearch from "algoliasearch/lite";
import config from "../../../config";
import { useURLQuery } from "shared/utils/location";

const SearchWrap = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 1120px;

  h1 {
    margin: 0;
  }

  ul {
    padding: 0;
    list-style-type: none;
  }
`;

const HitWrap = styled.div`
  width: 550px;
  padding: 17px 0px;
  border-bottom: 1px solid #e2e2e2;

  a {
    display: block;
    font-size: 18px;
    color: #206cd1;
  }
`;

const Hit = ({ hit }) => (
  <HitWrap>
    <Link to={hit.slug}>
      <Highlight attribute="title" hit={hit} tagName="mark" />
    </Link>

    <Snippet attribute="excerpt" hit={hit} tagName="mark" />
  </HitWrap>
);

const HiddenSearchBox = connectSearchBox(() => null);

const SearchResults = () => {
  const { term } = useURLQuery();

  if (!config?.header?.search?.algoliaAppId) {
    return null;
  }

  const searchClient = algoliasearch(
    config.header.search.algoliaAppId,
    config.header.search.algoliaSearchKey
  );
  return (
    <InstantSearch
      searchState={{ query: term }}
      searchClient={searchClient}
      indexName={config?.header?.search?.indexName}
    >
      <SearchWrap>
        <Index
          key={config?.header?.search?.indexName}
          indexName={config?.header?.search?.indexName}
        >
          <h1>Here are all the results for “{term}”</h1>
          <Hits hitComponent={Hit} />
        </Index>
        <Configure hitsPerPage={1000} />
        <HiddenSearchBox />
      </SearchWrap>
    </InstantSearch>
  );
};

export default SearchResults;
