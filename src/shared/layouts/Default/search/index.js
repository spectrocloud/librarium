import React, { useState, useEffect, createRef } from "react";
import {
  InstantSearch,
  Index,
  Hits,
  Configure,
  connectStateResults,
} from "react-instantsearch-dom";
import algoliasearch from "algoliasearch/lite";

import styled, { css } from "styled-components";
import { PoweredBy } from "./styles";
import Input from "./input";
import * as hitComps from "./hitComps";
import { useLocation } from "@reach/router";

const HitsWrapper = styled.div`
  display: ${(props) => (props.show ? `grid` : `none`)};
  max-height: 80vh;
  overflow: auto;
  z-index: 2;
  -webkit-overflow-scrolling: touch;
  position: absolute;
  top: 85px;
  width: 500px;
  box-shadow: 0 2px 64px 0 rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  border: 1px solid #ddd;
  background: white;

  ${(props) =>
    props.center &&
    css`
      left: 5px;
    `}
  @media only screen and (max-width: 952px) {
    width: 100%;
    max-width: 100%;
    left: 0;
    top: 79px;
  }

  li {
    padding: 10px;

    &:hover {
      background-color: rgba(68, 50, 245, 0.05);

      mark {
        color: #206cd1;
        background-color: #fff;
      }
    }
  }

  mark {
    padding: 0 0.2em;
    border-radius: 3px;
    background-color: rgba(68, 50, 245, 0.05);
  }

  li + li {
    border-top: 1px solid #ddd;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.3em;
    h3 {
      color: black;
      background: #dadee3;
      padding: 0.1em 0.4em;
      border-radius: 3px;
    }
  }
  h3 {
    color: black;
    margin: 0 0 0.5em;
  }
  h4 {
    color: black;
    margin-bottom: 0.3em;
  }

  .poweredBy {
    padding: 10px;
    border-top: 1px solid #ddd;
    font-size: 12px;
    color: #555;
  }

  .front {
    padding: 10px;
    color: #ddd;

    :empty {
      padding: 0;
    }
  }
`;

const Root = styled.div`
  position: relative;
  display: grid;
  grid-gap: 1em;
  @media only screen and (max-width: 767px) {
    width: 100%;
  }
`;

const Results = connectStateResults(({ searching, searchState: state, searchResults: res }) => (
  <div className="front">
    {(searching && `Searching...`) ||
      (res && res.nbHits === 0 && `No results for '${state.query}'`)}
  </div>
));

const useClickOutside = (ref, handler, events) => {
  if (!events) events = [`click`, `touch`];
  const detectClickOutside = (event) =>
    ref && ref.current && !ref.current.contains(event.target) && handler();

  useEffect(() => {
    for (const event of events) document.addEventListener(event, detectClickOutside);
    return () => {
      for (const event of events) document.removeEventListener(event, detectClickOutside);
    };
  });
};

export default function SearchComponent({
  indices = [],
  collapse,
  hitsAsGrid,
  config,
  focusInput = false,
}) {
  const ref = createRef();
  const location = useLocation();

  if (!config?.header?.search?.algoliaAppId) {
    return <div></div>;
  }

  const [query, setQuery] = useState(``);

  const [focus, setFocus] = useState(false);

  const searchClient = algoliasearch(
    config.header.search.algoliaAppId,
    config.header.search.algoliaSearchKey
  );

  if (config?.header?.search?.indexName) {
    indices = [
      {
        name: `${config.header.search.indexName}`,
        title: `Results`,
        hitComp: `PageHit`,
      },
    ];
  }

  useEffect(() => {
    if (focusInput) {
      setFocus(true);
    }
  }, [focusInput]);

  useClickOutside(ref, () => setFocus(false));
  const displayResult = query?.length > 0 && focus ? "showResults" : "hideResults";

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={indices[0]?.name}
      onSearchStateChange={({ query }) => setQuery(query)}
      root={{ Root, props: { ref } }}
    >
      <Input
        onFocus={() => setFocus(true)}
        {...{ collapse, focus }}
        center={location.pathname !== "/"}
      />
      <HitsWrapper
        className={"hitWrapper " + displayResult}
        show={query?.length > 0 && focus}
        asGrid={hitsAsGrid}
        center={location.pathname !== "/"}
      >
        {indices.map(({ name, title, hitComp, type }) => {
          const Component = hitComps[hitComp];
          return (
            <Index key={name} indexName={name}>
              <Results />
              <Hits
                hitComponent={
                  Component
                    ? (props) => <Component {...props} onClick={() => setFocus(false)} />
                    : () => null
                }
              />
            </Index>
          );
        })}
        <PoweredBy />
      </HitsWrapper>
      <Configure hitsPerPage={5} />
    </InstantSearch>
  );
}
