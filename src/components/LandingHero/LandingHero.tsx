import React, { type ReactNode } from "react";
import styles from "./LandingHero.module.scss";

interface LandingHeroProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

// Decorative cluster motif: hub nodes ringed by hexagons, joined by edges.
// Coordinates are in the 520 x 360 viewBox.
const HEXES: Array<[number, number, number]> = [
  [300, 120, 46],
  [400, 206, 38],
  [246, 244, 32],
  [446, 78, 24],
];

const NODES: Array<{ x: number; y: number; r: number; pulseDelay?: number }> = [
  { x: 300, y: 120, r: 6, pulseDelay: 0 },
  { x: 400, y: 206, r: 6 },
  { x: 246, y: 244, r: 5, pulseDelay: 1.1 },
  { x: 446, y: 78, r: 4 },
  { x: 180, y: 84, r: 3.5 },
  { x: 120, y: 176, r: 3 },
  { x: 352, y: 304, r: 4, pulseDelay: 2.2 },
  { x: 482, y: 300, r: 3 },
  { x: 206, y: 330, r: 3 },
  { x: 500, y: 150, r: 3 },
];

const EDGES: Array<[number, number, number, number]> = [
  [300, 120, 400, 206],
  [300, 120, 246, 244],
  [300, 120, 446, 78],
  [300, 120, 180, 84],
  [400, 206, 246, 244],
  [400, 206, 352, 304],
  [400, 206, 482, 300],
  [400, 206, 500, 150],
  [246, 244, 120, 176],
  [246, 244, 206, 330],
  [246, 244, 352, 304],
  [446, 78, 500, 150],
  [180, 84, 120, 176],
];

function hexPoints(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    return `${(cx + r * Math.cos(angle)).toFixed(1)},${(cy + r * Math.sin(angle)).toFixed(1)}`;
  }).join(" ");
}

function ClusterMotif() {
  return (
    <svg className={styles.motif} viewBox="0 0 520 360" aria-hidden="true" focusable="false">
      <g className={styles.edges}>
        {EDGES.map(([x1, y1, x2, y2]) => (
          <line key={`${x1}-${y1}-${x2}-${y2}`} x1={x1} y1={y1} x2={x2} y2={y2} />
        ))}
      </g>
      <g className={styles.hexes}>
        {HEXES.map(([cx, cy, r]) => (
          <polygon key={`${cx}-${cy}`} points={hexPoints(cx, cy, r)} />
        ))}
      </g>
      <g className={styles.nodes}>
        {NODES.map((node) => (
          <circle
            key={`${node.x}-${node.y}`}
            cx={node.x}
            cy={node.y}
            r={node.r}
            className={node.pulseDelay !== undefined ? styles.pulse : undefined}
            style={node.pulseDelay !== undefined ? { animationDelay: `${node.pulseDelay}s` } : undefined}
          />
        ))}
      </g>
    </svg>
  );
}

// Homepage hero band. The page sets hide_title: true, so this H1 is the only page title.
export default function LandingHero({ title, description, children }: LandingHeroProps) {
  return (
    <header className={styles.hero}>
      <ClusterMotif />
      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.lead}>{description}</p>}
        {children && <div className={styles.ask}>{children}</div>}
      </div>
    </header>
  );
}
