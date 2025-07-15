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
  url: string;
  hideNumber?: boolean;
}

interface SimpleCardHeader {
  index?: number;
  hideNumber?: boolean;
  title: string;
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
          url={card.url}
          key={`simpleCard-${index}`}
          hideNumber={hideNumber}
        />
      ))}
    </div>
  );
}

function SimpleCard({ title, index, description, buttonText, url, hideNumber }: SimpleCard) {
  return (
    <a href={url}>
      <div className={styles.simpleCard}>
        <SimpleCardHeader index={index} title={title} hideNumber={hideNumber} />
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

function SimpleCardHeader({ index, hideNumber, title }: SimpleCardHeader) {
  if (!hideNumber) {
    return (
      <div className={styles.simpleCardHeader}>
        <div className={styles.simpleCardIndex}>{index}</div>
        <div className={styles.simpleCardTitle}>{title}</div>
      </div>
    );
  }
  return (
    <div className={styles.simpleCardHeaderNoGap}>
      <div className={styles.simpleCardTitle}>{title}</div>
    </div>
  );
}
