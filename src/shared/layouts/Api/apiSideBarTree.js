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
  width: 100%;

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

  return <div style={{ paddingLeft: count * 20 }}>{operations.map(renderOperation)}</div>;
}

export default function ApiSidebarTree(props) {
  const { pathname, hash } = useLocation();

  let arr =
    Object.keys(props.data).map((item) => {
      return props.data[item].status;
    }) || [];
  const [shouldExpand, setShouldExpand] = useState(arr);

  if (!Object.keys(props.data).length) {
    return null;
  }

  let count = props.count + 1;

  return (
    <div>
      {Object.keys(props.data).map((item, index) => {
        const isActive = `${pathname}` === `/api/v1/${item}/${hash}`;

        if (item === "status") {
          return null;
        }
        if (item === "operations") {
          return (
            <ApiSidebarArray operations={props.data[item]} count={count} isActive={isActive} />
          );
        }
        return (
          <div key={index} style={{ paddingLeft: 20 * count }}>
            <ApiButton
              isActive={isActive}
              onClick={() => {
                if (count === 0 && !pathname.includes(item)) {
                  navigate(`/api/v1/${item}`);
                }
                let arr = JSON.parse(JSON.stringify(shouldExpand));
                arr[index] = !shouldExpand[index];
                setShouldExpand(arr);
              }}
            >
              <span>{item}</span>
            </ApiButton>
            {shouldExpand[index] ? <ApiSidebarTree data={props.data[item]} count={count} /> : null}
          </div>
        );
      })}
    </div>
  );
}
