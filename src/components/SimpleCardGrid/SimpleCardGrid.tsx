import React from "react";
import styles from "./SimpleCardGrid.module.scss";

interface SimpleCardProps {
  cards?: SimpleCard[];
  cardsPerRow: number;
}

interface SimpleCard {
  title: string;
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
  cards.forEach((card) => {
    if (previousCards.length < cardsPerRow) {
      previousCards.push(card);
    } else {
      // The row is full. Save it and reset the cards buffer.
      const row: SimpleCardRow = { cards: previousCards.slice() };
      rows.push(row);
      previousCards = [] as SimpleCard[];
      // Add the current card to the newly emptied buffer.
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

function SimpleCard({ title, description, buttonText, relativeURL }: SimpleCard) {
  return (
    <div className={styles.simpleCardWrapper}>
      <a href={relativeURL}>
        <div className={styles.simpleCard}>
          <div className="card__header">
            <h3>{title}</h3>
          </div>
          <div className="card__body">
            <p>{description}</p>
          </div>
          <div className="card__footer">
            <button className="button button--secondary button--block">{buttonText}</button>
          </div>
        </div>
      </a>
    </div>
  );
}
