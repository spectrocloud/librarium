import React from "react";
import styles from "./SimpleCardGrid.module.scss";

interface SimpleCardProps {
  cards?: SimpleCard[];
  cardsPerRow: number;
}

interface SimpleCard {
  title: string;
  index: number;
  description: string;
  buttonText: string;
  relativeURL: string;
}

interface SimpleCardRow {
  cards: SimpleCard[];
}

export default function SimpleCardGrid({ cards = [], cardsPerRow }: SimpleCardProps) {
  // Construct the rows according to how many elements we want per row
  let previousCards: SimpleCard[] = [];
  const rows: SimpleCardRow[] = [];
  cards.forEach((card, index) => {
    if (previousCards.length < cardsPerRow) {
      // Offset zero index
      card.index = index + 1;
      previousCards.push(card);
    } else {
      // The row is full. Save it and reset the cards buffer.
      const row: SimpleCardRow = { cards: previousCards.slice() };
      rows.push(row);
      previousCards = [] as SimpleCard[];
      // Add the current card to the newly emptied buffer.
      card.index = index + 1 ;
      previousCards.push(card);
    }
  });
  // Create row for overflow cards, if any
  if (previousCards.length > 0) {
    const row: SimpleCardRow = { cards: previousCards.slice() };
    rows.push(row);
  }

  return (
    <div className={styles.simpleCardGrid}>
      {rows.map((row, index) => (
        <div className="row row--no-gutters" key={`simpleCardRow-${index}`}>
          {row.cards.map((card, index) => (
            <div className="col" key={`simpleCardCol-${index}`}>
              <SimpleCard {...card} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function SimpleCard({ title, index, description, buttonText, relativeURL }: SimpleCard) {
  return (
    <div className={styles.simpleCardWrapper}>
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
    </div>
  );
}
