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
  position: relative;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: red;
  font-size: 13px;
  color: white;
  text-align: center;
  cursor: pointer;

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

  ${props => props.isOpen && css`
    background: black;

    ::after {
      animation: none;
    }
  `}
`;

function PointOfInterest({
  position = "right",
  text = "Lorem ipsum",
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Tooltip trigger={["click"]} title={text} >
      <Circle isOpen={isOpen} onClick={() => setIsOpen(true)}>1</Circle>
    </Tooltip>
  )
}

export default PointOfInterest;
