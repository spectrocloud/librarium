import React, { useEffect } from "react";
import styled, { css } from "styled-components";
import { useLocation } from "@reach/router";
import { navigate } from "gatsby-link";
import { useSetupContext } from "shared/layouts/Persistent/provider";

const Wrap = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-left: ${(props) => 20 * (props.count || 0)}px;

  ::before {
    position: absolute;
    content: "";
    height: 100%;
    top: 0;
    left: 0px;
    border-left: 1px solid #ddd;
  }
`;

const ApiButton = styled.button`
  display: flex;
  padding: 12px 0px 12px 12px;
  font-size: 12px;
  line-height: 16px;
  color: rgb(150, 152, 169);
  font-weight: 500;
  cursor: pointer;
  background: transparent;
  border: none;
  text-align: left;
  flex-grow: 1;
  margin-left: ${(props) => 10 * (props.count || 0)}px;

  :hover,
  :hover span {
    color: rgb(32, 108, 209);
  }

  span {
    position: relative;
    font-size: 14px;
    line-height: 16px;
    color: rgb(74, 75, 106);
    margin-left: 10px;
    margin-left: ${(props) => 10 * (props.count || 0)}px;

    :hover {
      color: rgb(32, 108, 209);
    }
  }

  ${(props) =>
    props.isActive &&
    css`
      background: linear-gradient(0deg, rgba(255, 255, 255, 0.93), rgba(255, 255, 255, 0.93)),
        rgb(32, 108, 209);
      font-weight: 600;
      color: rgb(32, 108, 209);
      border-right: 5px solid rgb(32, 108, 209);
    `}

  ${(props) =>
    props.isActiveParent &&
    css`
      span {
        font-weight: 600;
        color: rgb(32, 108, 209);
      }
    `}
`;

function ApiSidebarArray({ root, route, operations, count }) {
  const { hash } = useLocation();
  function renderOperation({ operationId, summary }) {
    const isActive = `${hash}` === `#${operationId}`;

    return (
      <ApiButton
        isActive={isActive}
        key={`${route}-${operationId}`}
        onClick={() => {
          navigate(`/api/v1/${root}/#${operationId}`);
        }}
      >
        {summary}
      </ApiButton>
    );
  }
  return <Wrap count={count}>{operations.map(renderOperation)}</Wrap>;
}

export default function ApiSidebarTree({ root = null, route = null, branches, initialCount }) {
  const { pathname } = useLocation();
  const [state, dispatch] = useSetupContext();

  const getRouteValue = (value) => (route ? `${route}-${value}` : value);
  const isVisitedRoute = (item) => {
    return state.visitedRoutes.find((vRoute) => vRoute === getRouteValue(item));
  };

  useEffect(() => {
    const pathRoutes = pathname.split("/");
    const item = pathRoutes[pathRoutes.length - 2];
    // ##### first level #######
    if (branches[item] && !isVisitedRoute(item)) {
      dispatch({ type: "ADD_VISITED_ROUTE", value: route || item });
    }

    // ###### nested levels ########
    // const nestedItems = hash.split(/(?=[A-Z])/).map((str) => str.toLowerCase());
    // const nestedItem = Object.keys(branches).find((key) => nestedItems.includes(key));
    // if (nestedItem && !isVisitedRoute(item)) {
    //   dispatch({ type: "ADD_VISITED_ROUTE", value: nestedItem });
    // }
  }, []);

  const onClickItem = (item) => () => {
    if (count === 0 && !pathname.includes(item)) {
      navigate(`/api/v1/${item}/`);
    }

    if (!isVisitedRoute(item)) {
      dispatch({ type: "ADD_VISITED_ROUTE", value: getRouteValue(item) });
    } else {
      dispatch({ type: "REMOVE_VISITED_ROUTE", value: getRouteValue(item) });
      count === 0 && navigate(`/api/v1/${item}/`);
    }
  };

  if (!Object.keys(branches).length) return null;
  const count = initialCount + 1;

  return (
    <div>
      {Object.keys(branches).map((item, index) => {
        const isActive = isVisitedRoute(item);

        if (["status", "title"].includes(item)) return null;

        if (item === "operations") {
          return (
            <ApiSidebarArray
              root={root || item}
              route={getRouteValue(item)}
              operations={branches[item]}
              count={count}
              isActive={isActive}
            />
          );
        }

        return (
          <Wrap key={`${route ? `${route}-${item}` : item}-${index}`}>
            <ApiButton count={count} isActiveParent={isActive} onClick={onClickItem(item)}>
              <span>{branches[item]?.title || item}</span>
            </ApiButton>
            {isActive ? (
              <ApiSidebarTree
                root={root || item}
                route={getRouteValue(item)}
                branches={branches[item]}
                initialCount={count}
              />
            ) : null}
          </Wrap>
        );
      })}
    </div>
  );
}
