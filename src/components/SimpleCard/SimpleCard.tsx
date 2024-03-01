import React, { useState, RefObject } from "react";
import styles from "./SimpleCard.module.scss";

interface SimpleCardProps {
  cards?: SimpleCard[];
  elemsPerRow: number;
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

export default function SimpleCardGrid({ cards = [], elemsPerRow }: SimpleCardProps) {
  // Construct the rows according to how many elements we want per row
  var previousCards: SimpleCard[] = [];
  var rows: SimpleCardRow[] = [];
  cards.map(function (card, index) {
    if (previousCards.length < elemsPerRow) {
      previousCards.push(card);
    } else {
      // The row is full. Save it and reset the cards buffer.
      var row: SimpleCardRow = { cards: previousCards.slice() };
      rows.push(row);
      previousCards = [] as SimpleCard[];
      // Add the current card to the newly emptied buffer.
      previousCards.push(card);
    }
  });
  // Create row for overflow cards, if any
  if (previousCards.length > 0) {
    var row: SimpleCardRow = { cards: previousCards.slice() };
    rows.push(row);
  }

  return (
    <div className="container">
      {rows.map((row) => (
        <div className="row">
          {row.cards.map((card) => (
            <div className="col col--6">
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
