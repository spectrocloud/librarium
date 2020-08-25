import React, { useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { Tooltip } from "antd";

const pulse = keyframes`
 0% {
    transform: scale(1);
    box-shadow: inset 0 0 1px 1px rgba(217, 83, 83, 0.8);
  }

  50% {
    box-shadow: inset 0 0 1px 1px rgba(217, 83, 83, 0.8);
  }

  100% {
    transform: scale(1.6);
    box-shadow: inset 0 0 1px 1px rgba(217, 83, 83, 0);
  }
`;

const Circle = styled.div`
  position: absolute;
  top: ${props => `${props.y}px}`};
  left: ${props => `${props.x}px}`};
  z-index: 1;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: #d95353;
  box-shadow: 0 0 10px rgba(0,0,0,.3), inset 0 1px 0 rgba(255,255,255,.3);
  color: white;
  text-align: center;
  cursor: pointer;

  > div {
    transition: transform 0.3s ease-in-out;
  }

  ::after {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    top:0;
    left: 0;
    border-radius: 50%;
    animation: ${pulse} 1s infinite;
  }

  ${props => props.isVisited && css`
    background: #475f74;

    ::after {
      animation: none;
    }
  `}

  ${props => props.isOpened && !props.useIndex && css`
    > div {
      transform: rotate(135deg);
    }
  `}
`;

function Point({description, placement = "right", x , y, index, useIndex}) {
  const [isVisited, setIsVisited] = useState(false);
  const [isOpened, setIsOpened] = useState(false);

  return (
    <Tooltip
      trigger={["click"]}
      title={description}
      placement={placement}
      onVisibleChange={(visible) => setIsOpened(visible)}>
        <Circle
          x={x}
          y={y}
          useIndex={useIndex}
          isOpened={isOpened}
          isVisited={isVisited}
          onClick={() => setIsVisited(true)}>
            <div>
              {useIndex ? index + 1 : "+"}
            </div>
        </Circle>
    </Tooltip>
  )
}

function PointsOfInterest({
  options = [],
  useIndex = false,
}) {
  return options.map((point, index) => <Point {...point} index={index} useIndex={useIndex} />);
}

export default PointsOfInterest;
