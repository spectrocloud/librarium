import React, { type ReactNode } from "react";
import styles from "./LandingHero.module.scss";

// Decorative fold motif: stacked paper sheets, one folded flap, and crease lines.
// Every edge runs at the brand fold angle of 38.5 degrees. The 600 x 300 viewBox scales uniformly, so the angle holds.
const SLOPE = Math.tan((38.5 * Math.PI) / 180);
const RUN = 300 / SLOPE; // Horizontal run of an edge that spans the full height.
const SCALE = 0.9; // CSS pixels per viewBox unit. A fixed scale keeps the flap in place whatever the hero height.
const DEPTH = 900; // Sheets and lines run past the viewBox bottom to this depth, so they fill a taller hero.
const SHEETS = [60, 200, 340]; // Where each sheet edge crosses the viewBox bottom.
const [FLAP_LEFT, FLAP_RIGHT] = [SHEETS[0] + RUN, SHEETS[1] + RUN]; // Where the first two sheet edges meet the top.
const FLAP_TIP = `${(FLAP_LEFT + FLAP_RIGHT) / 2},${((FLAP_RIGHT - FLAP_LEFT) / 2) * SLOPE}`;
const CREASES = [140, 280]; // Where each thin crease leaves the top.

function MotifLayer({ children }: { children: ReactNode }) {
  return (
    <svg
      className={styles.motif}
      width={600 * SCALE}
      height={300 * SCALE}
      viewBox="0 0 600 300"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

function FallingLine({ x, className }: { x: number; className: string }) {
  return <line className={className} x1={x} y1={0} x2={x + DEPTH / SLOPE} y2={DEPTH} />;
}

function FoldMotif() {
  return (
    <>
      <MotifLayer>
        {SHEETS.map((x) => (
          <polygon
            key={x}
            className={styles.sheet}
            points={`${x - (DEPTH - 300) / SLOPE},${DEPTH} ${x + RUN},0 900,0 900,${DEPTH}`}
          />
        ))}
        <polygon className={styles.flap} points={`${FLAP_LEFT},0 ${FLAP_RIGHT},0 ${FLAP_TIP}`} />
        <FallingLine x={FLAP_LEFT} className={styles.foldLine} />
      </MotifLayer>
      <div className={styles.lines}>
        <MotifLayer>
          {CREASES.map((x) => (
            <FallingLine key={x} x={x} className={styles.crease} />
          ))}
        </MotifLayer>
      </div>
    </>
  );
}

// Homepage hero band. The page sets hide_title: true, so this H1 is the only page title.
export default function LandingHero({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <header className={styles.hero}>
      <FoldMotif />
      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        {children && <div className={styles.ask}>{children}</div>}
      </div>
    </header>
  );
}
