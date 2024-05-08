import React from "react";
import styles from "./Technologies.module.scss";
import PackCardIcon from "./PackCardIcon";
import Link from "@docusaurus/Link";

interface TechnologyCardProps {
  name: string;
  title: string;
  logoUrl: string;
  type: string;
}

export default function TechnologyCard({ name, title, logoUrl, type }: TechnologyCardProps) {
  return (
    <div className={styles.card}>
      <Link to={`/integrations/packs/${name}`}>
        <PackCardIcon title={title} logoUrl={logoUrl} type={type} />
        <div className={styles.title}>{title}</div>
      </Link>
    </div>
  );
}
