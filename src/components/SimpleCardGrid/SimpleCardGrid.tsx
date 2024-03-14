import React from "react";
import styles from "./SimpleCardGrid.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";

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
        />
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
          <button className={styles.simpleCardFooterBtn}>
            {buttonText}
            <FontAwesomeIcon className="fa-lg" icon={faArrowRightLong} />
          </button>
        </div>
      </div>
    </a>
  );
}
