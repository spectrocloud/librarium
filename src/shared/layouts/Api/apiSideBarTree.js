import React, { useState, useRef, useEffect } from "react";
import styled, { css } from "styled-components";
import { useLocation } from "@reach/router";
import { navigate } from "gatsby-link";
import { useSetupContext } from "shared/layouts/Persistent/provider";

const Wrap = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-left: ${(props) => 20 * (props.count || 0)}px;

  ${(props) =>
    props.count > 1 &&
    css`
      ::before {
        position: absolute;
        content: "";
        height: 100%;
        top: 0;
        left: 0px;
        border-left: 1px solid #ddd;
      }
    `}
`;

const ApiButton = styled.button`
  display: flex;
  padding: 12px 0px 12px 12px;
  font-size: 14px;
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

function ApiSidebarArray({ rootItem, item, operations, count }) {
  const btnRef = useRef(null);
  const { hash } = useLocation();
  function renderOperation({ operationId, summary }, index) {
    const isActive = `${hash}` === `#${operationId}`;

    return (
      <ApiButton
        ref={btnRef}
        isActive={isActive}
        key={`${item}-${operationId}-${index}`}
        onClick={() => {
          navigate(`/api/v1/${rootItem}/#${operationId}`);
          btnRef.current.scrollIntoView({
            behavior: "instant",
            block: "center",
          });
        }}
      >
        {summary}
      </ApiButton>
    );
  }
  return <Wrap count={count}>{operations.map(renderOperation)}</Wrap>;
}

export default function ApiSidebarTree({
  rootParent = null,
  parent = null,
  branches,
  initialCount,
}) {
  const { pathname, hash } = useLocation();
  const [state, dispatch] = useSetupContext();

  const getValue = (item) => `${rootParent || item}-${item}`;
  const isVisited = (item) => state.visitedRoutes.find((route) => route === item);
  const branchesStatus = Object.keys(branches).map((item) => !!isVisited(getValue(item))) || [];
  const refs = Object.keys(branches).reduce((acc, item) => {
    if (["status", "title", "operations"].includes(item)) return acc;
    acc[item] = React.createRef();
    return acc;
  }, {});
  const [expandedItems, setExpandedItems] = useState(branchesStatus);

  useEffect(() => {
    const routes = pathname.split("/");
    const item = routes[routes.length - 2];
    if (refs[item]) {
      refs[item].current.scrollIntoView({
        behavior: "instant",
        block: "center",
      });
    }
    const index = Object.keys(branches).findIndex((key) => key === item);
    // ##### first level #######
    if (branches[item] && !expandedItems[index]) {
      setExpandedItems((expandedItems) => {
        const tempExpandedItems = [...expandedItems];
        tempExpandedItems.splice(index, 1, true);
        return tempExpandedItems;
      });
      dispatch({ type: "ADD_VISITED_ROUTE", value: getValue(item) });
    }
    // ###### nested levels ########
    const nestedItems = hash.split(/(?=[A-Z])/).map((str) => str.toLowerCase());
    const nestedItem = Object.keys(branches).find((key) => nestedItems.includes(key));
    const nestedIndex = Object.keys(branches).findIndex((key) => key === nestedItem);
    if (nestedItem && !expandedItems[nestedIndex]) {
      setExpandedItems((expandedItems) => {
        const tempExpandedItems = [...expandedItems];
        tempExpandedItems.splice(nestedIndex, 1, true);
        return tempExpandedItems;
      });
      dispatch({ type: "ADD_VISITED_ROUTE", value: getValue(nestedItem) });
    }
  }, []);

  const onClickItem = (item, index) => () => {
    if (count === 0 && !pathname.includes(item)) {
      navigate(`/api/v1/${item}/`);
    }
    const tempArr = [...expandedItems];
    tempArr[index] = !tempArr[index];
    setExpandedItems(tempArr);
    if (tempArr[index]) {
      dispatch({ type: "ADD_VISITED_ROUTE", value: getValue(item) });
    } else {
      dispatch({ type: "REMOVE_VISITED_ROUTE", value: getValue(item) });
      count === 0 && navigate(`/api/v1/${item}/`);
    }
  };

  if (!Object.keys(branches).length) {
    return null;
  }

  const count = initialCount + 1;
  return (
    <div>
      {Object.keys(branches).map((item, index) => {
        const isActive = pathname.includes(item);

        if (item === "status" || item === "title") return null;

        if (item === "operations") {
          return (
            <ApiSidebarArray
              rootItem={rootParent || item}
              item={parent || item}
              operations={branches[item]}
              count={count}
              isActive={isActive}
            />
          );
        }

        return (
          <Wrap key={`${rootParent || item}-${parent || item}-${index}`}>
            <ApiButton
              ref={refs[item]}
              count={count}
              isActiveParent={isActive}
              onClick={onClickItem(item, index)}
            >
              <span>{branches[item]?.title || item}</span>
            </ApiButton>
            {expandedItems[index] ? (
              <ApiSidebarTree
                rootParent={rootParent || item}
                parent={item}
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
