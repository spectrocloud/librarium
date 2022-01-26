import React, { useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { Tooltip } from "antd";

const pulse = keyframes`
 0% {
    transform: scale(1);
    box-shadow: inset 0 0 1px 1px rgba(38, 130, 250, 0.8);
  }

  50% {
    box-shadow: inset 0 0 1px 1px rgba(38, 130, 250, 0.8);
  }

  100% {
    transform: scale(1.6);
    box-shadow: inset 0 0 1px 1px rgba(38, 130, 250, 0);
  }
`;

const Wrapper = styled.div`
  position: relative;

  .ant-tooltip {
    z-index: 1;
  }
`;

const Circle = styled.div`
  position: absolute;
  top: ${(props) => `${props.y}px}`};
  left: ${(props) => `${props.x}px}`};
  transform: translate(-12px, -12px);
  z-index: 1;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #2682fa;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3);
  color: white;
  text-align: center;
  cursor: pointer;

  > div {
    transition: transform 0.3s ease-in-out;
  }

  ::after {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 50%;
    animation: ${pulse} 1s infinite;
  }

  ${(props) =>
    props.isVisited &&
    css`
      background: #475f74;

      ::after {
        animation: none;
      }
    `}
`;

const wrapRef = React.createRef();

function Point({ description, tooltipPlacement = "right", x, y, label }) {
  const [isVisited, setIsVisited] = useState(false);
  const [isOpened, setIsOpened] = useState(false);

  return (
    <Tooltip
      getPopupContainer={() => wrapRef.current}
      trigger={["click"]}
      title={description}
      color="#091e3b"
      placement={tooltipPlacement}
      onVisibleChange={(visible) => setIsOpened(visible)}
    >
      <Circle
        x={x}
        y={y}
        isOpened={isOpened}
        isVisited={isVisited}
        onClick={() => setIsVisited(true)}
      >
        <div>{label || "+"}</div>
      </Circle>
    </Tooltip>
  );
}

function PointsOfInterest({ points = [], children }) {
  return (
    <Wrapper ref={wrapRef}>
      {points.map((point, index) => (
        <Point {...point} index={index} />
      ))}
      {children}
    </Wrapper>
  );
}

export default PointsOfInterest;
