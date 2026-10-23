import React from "react";
import Link from "@docusaurus/Link";
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
  buttonText?: string;
  url: string;
  hideNumber?: boolean;
  tags?: string[];
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
          tags={card.tags}
        />
      ))}
    </div>
  );
}

function SimpleCard({ title, index, description, buttonText = "Learn more", url, hideNumber, tags }: SimpleCard) {
  const body = SimpleCardBody(title, description, buttonText, index, hideNumber, tags);
  return <Link to={url}>{body}</Link>;
}

function SimpleCardBody(
  title: string,
  description: string,
  buttonText: string,
  index?: number,
  hideNumber?: boolean,
  tags?: string[]
) {
  return (
    <div className={styles.simpleCard}>
      <SimpleCardHeader index={index} title={title} hideNumber={hideNumber} />
      <div className={styles.simpleCardBody}>
        <p className={styles.simpleCardDescription}>{description}</p>
        {tags && (
          <div className={styles.simpleCardTags}>
            <strong>Environments:</strong>&ensp;{tags.join("\u2002·\u2002")}
          </div>
        )}
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
