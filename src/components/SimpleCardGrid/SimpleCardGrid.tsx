import React from "react";
import Link from "@docusaurus/Link";
import styles from "./SimpleCardGrid.module.scss";
import SimpleCardFooterArrow from "./SimpleCardFooterArrow";
import IconMapper from "../IconMapper/IconMapper";

interface SimpleCardProps {
  cards?: SimpleCard[];
  hideNumber?: boolean;
  compact?: boolean;
}

interface SimpleCard {
  title: string;
  index?: number;
  description: string;
  buttonText?: string;
  url: string;
  hideNumber?: boolean;
  tags?: string[];
  icon?: string;
  compact?: boolean;
}
interface SimpleCardHeader {
  index?: number;
  hideNumber?: boolean;
  title: string;
  icon?: string;
}

export default function SimpleCardGrid({ cards = [], hideNumber = false, compact = false }: SimpleCardProps) {
  const gridClassName = compact ? `${styles.simpleCardGrid} ${styles.simpleCardGridCompact}` : styles.simpleCardGrid;
  return (
    <div className={gridClassName} data-columns={compact ? Math.min(cards.length, 4) : undefined}>
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
          icon={card.icon}
          compact={compact}
        />
      ))}
    </div>
  );
}

function SimpleCard({
  title,
  index,
  description,
  buttonText = "Learn more",
  url,
  hideNumber,
  tags,
  icon,
  compact,
}: SimpleCard) {
  const body = SimpleCardBody(title, description, buttonText, index, hideNumber, tags, icon, compact);
  return <Link to={url}>{body}</Link>;
}

function SimpleCardBody(
  title: string,
  description: string,
  buttonText: string,
  index?: number,
  hideNumber?: boolean,
  tags?: string[],
  icon?: string,
  compact?: boolean
) {
  const cardClassName = compact ? `${styles.simpleCard} ${styles.simpleCardCompact}` : styles.simpleCard;
  return (
    <div className={cardClassName}>
      <SimpleCardHeader index={index} title={title} hideNumber={hideNumber} icon={icon} />
      <div className={styles.simpleCardBody}>
        <p className={styles.simpleCardDescription}>{description}</p>
      </div>
      <div className={styles.simpleCardFooter}>
        {tags && <SimpleCardTags tags={tags} />}
        {compact ? (
          // A text link look. The whole card is already a link, so it is not a second interactive element.
          <span className={styles.simpleCardFooterLink}>
            {buttonText}
            <SimpleCardFooterArrow index={index} />
          </span>
        ) : (
          <button className={styles.simpleCardFooterBtn}>
            {buttonText}
            <SimpleCardFooterArrow index={index} />
          </button>
        )}
      </div>
    </div>
  );
}

// Environments are plain text, never chips. Each value stays on one line, so "Air-gapped" never splits.
function SimpleCardTags({ tags }: { tags: string[] }) {
  return (
    <div className={styles.simpleCardTags}>
      <strong>Environments:</strong>&ensp;
      {tags.map((tag, i) => (
        <React.Fragment key={tag}>
          {i > 0 && " · "}
          <span className={styles.simpleCardTagValue}>{tag}</span>
        </React.Fragment>
      ))}
    </div>
  );
}

function SimpleCardHeader({ index, hideNumber, title, icon }: SimpleCardHeader) {
  if (icon) {
    return (
      <div className={styles.simpleCardHeader}>
        <div className={styles.simpleCardIcon}>
          <IconMapper type={icon} />
        </div>
        <div className={styles.simpleCardTitle}>{title}</div>
      </div>
    );
  }
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
