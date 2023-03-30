import React, { useState } from "react";
import styled, { css } from "styled-components";
import { useLocation } from "@reach/router";
import { navigate } from "gatsby-link";

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

  :hover {
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
`;

function ApiSidebarArray({ operations, count }) {
  const { hash } = useLocation();
  function renderOperation({ operationId, summary }, index) {
    const isActive = `${hash}` === `#${operationId}`;

    return (
      <ApiButton
        isActive={isActive}
        key={`${operationId}-${index}`}
        onClick={() => {
          navigate(`#${operationId}`);
        }}
      >
        {summary}
      </ApiButton>
    );
  }
  return <Wrap count={count}>{operations.map(renderOperation)}</Wrap>;
}

export default function ApiSidebarTree({ branches, initialCount }) {
  const { pathname, hash } = useLocation();

  let branchesStatus =
    Object.keys(branches).map((item) => {
      return branches[item].status;
    }) || [];
  const [expandedItems, setExpandedItems] = useState(branchesStatus);

  if (!Object.keys(branches).length) {
    return null;
  }

  let count = initialCount + 1;

  return (
    <div>
      {Object.keys(branches).map((item, index) => {
        const isActive = `${pathname}/` === `/api/v1/${item}/${hash}`;

        if (item === "status" || item === "title") {
          return null;
        }
        if (item === "operations") {
          return <ApiSidebarArray operations={branches[item]} count={count} isActive={isActive} />;
        }
        return (
          <Wrap key={index}>
            <ApiButton
              count={count}
              isActive={isActive}
              onClick={() => {
                if (count === 0 && !pathname.includes(item)) {
                  navigate(`/api/v1/${item}`);
                }
                let arr = [...expandedItems];
                arr[index] = !expandedItems[index];
                setExpandedItems(arr);
              }}
            >
              <span>{branches[item]?.title || item}</span>
            </ApiButton>
            {expandedItems[index] ? (
              <ApiSidebarTree branches={branches[item]} initialCount={count} />
            ) : null}
          </Wrap>
        );
      })}
    </div>
  );
}
