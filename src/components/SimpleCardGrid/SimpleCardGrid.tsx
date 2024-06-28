import React from "react";
import styles from "./SimpleCardGrid.module.scss";
import SimpleCardFooterArrow from "./SimpleCardFooterArrow";

interface SimpleCardProps {
  cards?: SimpleCard[];
  hideNumber?: boolean;
}

interface SimpleCard {
  title: string;
  index?: number;
  description: string;
  buttonText: string;
  relativeURL: string;
  hideNumber?: boolean;
}

interface SimpleCardNumber {
  index?: number;
  hideNumber?: boolean;
}

export default function SimpleCardGrid({ cards = [], hideNumber = false }: SimpleCardProps) {
  return (
    <div className={styles.simpleCardGrid}>
      {cards.map((card, index) => (
        <SimpleCard
          title={card.title}
          index={index + 1}
          description={card.description}
          buttonText={card.buttonText}
          relativeURL={card.relativeURL}
          key={`simpleCard-${index}`}
          hideNumber={hideNumber}
        />
      ))}
    </div>
  );
}

function SimpleCard({ title, index, description, buttonText, relativeURL, hideNumber }: SimpleCard) {
  console.log(hideNumber);
  return (
    <a href={relativeURL}>
      <div className={styles.simpleCard}>
        <div className={styles.simpleCardHeader}>
          <SimpleCardNumber hideNumber={hideNumber} index={index} />
          <div className={styles.simpleCardTitle}>{title}</div>
        </div>
        <div className={styles.simpleCardBody}>
          <p className={styles.simpleCardDescription}>{description}</p>
        </div>
        <div className={styles.simpleCardFooter}>
          <button className={styles.simpleCardFooterBtn}>
            {buttonText}
            <SimpleCardFooterArrow index={index} />
          </button>
        </div>
      </div>
    </a>
  );
}

function SimpleCardNumber({ index, hideNumber }: SimpleCardNumber) {
  if (!hideNumber) {
    return <div className={styles.simpleCardIndex}>{index}</div>;
  }
  return <div />;
}
