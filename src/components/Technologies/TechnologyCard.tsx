import React from "react";
import Link from "@docusaurus/Link";
import styles from "./Technologies.module.scss";

interface TechnologyCardProps {
  title: string;
  slug: string;
  logoUrl: string;
}

export default function TechnologyCard({
  title,
  slug,
  logoUrl,
}: TechnologyCardProps) {
  return (
    <Link key={title} to={slug}>
      <div className={styles.card}>
        <div className={styles.imageWrapper}>
          <img src={logoUrl} alt={`${title} logo`} />
        </div>
        <div className={styles.title}>{title}</div>
      </div>
    </Link>
  );
}
