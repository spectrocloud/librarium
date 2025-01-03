import React from "react";
import styles from "./SimpleCardGrid.module.scss";
import SimpleCardFooterArrow from "./SimpleCardFooterArrow";
import VersionedLink from "../VersionedLink";

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
          key={`simpleCard-${index}`}
          url={card.url}
          hideNumber={hideNumber}
        />
      ))}
    </div>
  );
}

function SimpleCard({ title, index, description, buttonText, url, hideNumber }: SimpleCard) {
  const body = SimpleCardBody(title, description, buttonText, index, hideNumber);
  return <VersionedLink url={url} component={body} />;
}

function SimpleCardBody(title: string, description: string, buttonText: string, index?: number, hideNumber?: boolean) {
  return (
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
