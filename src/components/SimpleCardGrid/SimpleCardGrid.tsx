import React from "react";
import styles from "./SimpleCardGrid.module.scss";

interface SimpleCardProps {
  cards?: SimpleCard[];
}

interface SimpleCard {
  title: string;
  index?: number;
  description: string;
  buttonText: string;
  relativeURL: string;
}

export default function SimpleCardGrid({ cards = [] }: SimpleCardProps) {
  // Construct the rows according to how many elements we want per row
  cards.forEach((card, index) => {
      // Offset zero index
      card.index = index + 1;
  });

  return (
    <div className={styles.simpleCardGrid}>
      {cards.map((card) => (
        <SimpleCard {...card} key={`simpleCard-${card.index}`} />
      ))}
    </div>
  );
}

function SimpleCard({ title, index, description, buttonText, relativeURL }: SimpleCard) {
  return (
    <a href={relativeURL}>
      <div className={styles.simpleCard}>
        <div className={styles.simpleCardHeader}>
          <div className={styles.simpleCardIndex}>{index}</div>
          <div className={styles.simpleCardTitle}>{title}</div>
        </div>
        <div className={styles.simpleCardBody}>
          <p className={styles.simpleCardDescription}>{description}</p>
        </div>
        <div className={styles.simpleCardFooter}>
          <button className="button button--secondary">{buttonText}</button>
        </div>
      </div>
    </a>
  );
}
