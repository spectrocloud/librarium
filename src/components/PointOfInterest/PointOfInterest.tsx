import React, { useState, RefObject } from "react";
import { Tooltip } from "antd";
import styles from "./PointOfInterest.module.scss";
import { TooltipPlacement } from "antd/es/tooltip/index";

interface PointProps {
  description: string;
  tooltipPlacement?: string;
  x: number;
  y: number;
  label?: string;
  wrapRef: RefObject<HTMLElement>;
  index?: number;
}

function Point({ description, tooltipPlacement = "right", x, y, label, wrapRef }: PointProps) {
  const [isVisited, setIsVisited] = useState(false);

  return (
    <Tooltip
      getPopupContainer={(triggerNode) => wrapRef.current || triggerNode}
      trigger={["click"]}
      title={description}
      color="#091e3b"
      placement={tooltipPlacement as TooltipPlacement}
    >
      <div
        aria-hidden="true"
        style={{ top: `${y}px`, left: `${x}px` }}
        className={`${styles.circle} ${isVisited ? styles.isVisited : ""}`}
        onClick={() => {
          setIsVisited(true);
        }}
      >
        <div>{label || "+"}</div>
      </div>
    </Tooltip>
  );
}

interface PointOfInterest {
  description: string;
  tooltipPlacement?: string;
  x: number;
  y: number;
  label?: string;
}

interface PointsOfInterestProps {
  points?: PointOfInterest[];
  children?: React.ReactNode;
}

export default function PointsOfInterest({ points = [], children }: PointsOfInterestProps) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const wrapRef = React.createRef<HTMLDivElement>();

  return (
    <div
      className={styles.wrapper}
      ref={wrapRef}
      onScroll={(ev) => {
        const target = ev.target as HTMLDivElement;
        setOffset({ x: target.scrollLeft, y: target.scrollTop });
      }}
    >
      <div
        className={styles.pointsWrapper}
        style={{
          transform: `translate(-${offset.x}px, -${offset.y}px)`,
        }}
      >
        {points.map((point, index) => (
          <Point {...point} index={index} key={index} wrapRef={wrapRef} />
        ))}
      </div>
      {children}
    </div>
  );
}
