import React, { useState } from "react";
import styled, { css } from "styled-components";
import { useLocation } from "@reach/router";
import { navigate } from "gatsby-link";

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
  text-transform: capitalize;
  flex-grow: 1;

  :hover {
    color: rgb(32, 108, 209);
  }

  span {
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

  return (
    <div style={{ marginLeft: count * 20, display: "flex", flexDirection: "column" }}>
      {operations.map(renderOperation)}
    </div>
  );
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
          <div key={index} style={{ display: "flex", flexDirection: "column" }}>
            <ApiButton
              style={{ marginLeft: 20 * count }}
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
          </div>
        );
      })}
    </div>
  );
}
