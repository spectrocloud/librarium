import React from "react";
import styles from "./Technologies.module.scss";
import PackCardIcon from "./PackCardIcon";
import Link from "@docusaurus/Link";

interface TechnologyCardProps {
  name?: string;
  title: string;
  logoUrl: string;
  type?: string;
  slug?: string;
  version?: string;
  versions?: any;
}

export default function TechnologyCard({ name, title, logoUrl, type, slug, version, versions }: TechnologyCardProps) {
  const parentVersion = versions?.find((tagVersion: any) => tagVersion.children.find((child: any) => child.title === version))?.title || "";
  return (
    <div className={styles.card}>
      <Link to={slug || `/integrations/packs?pack=${name}&version=${version}&parent=${parentVersion}`}>
        <div className={styles.cardContent}>
          <PackCardIcon appType={slug ? "app" : "integration"} logoUrl={logoUrl} type={type} />
          <div className={styles.title}>{title}</div>
        </div>
      </Link>
    </div>
  );
}
