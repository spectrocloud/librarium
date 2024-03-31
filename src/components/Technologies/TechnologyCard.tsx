import React from "react";
import Link from "@docusaurus/Link";
import styles from "./Technologies.module.scss";
import PackCardIcon from "./PackCardIcon";
import osLayerIcon from "@site/static/assets/packs/os_layer.svg";
import Image from "@theme/IdealImage";
import IconMapper from "@site/src/components/IconMapper/IconMapper";


interface TechnologyCardProps {
  title: string;
  slug: string;
  logoUrl: string;
  type: string;
}

export default function TechnologyCard({ title, slug, logoUrl, type }: TechnologyCardProps) {
  const handleImageError = (e: any) => {
    console.log(`Failed to load e.target.src: ${e.target.src}`);
    e.target.src.display = "none"
    //<IconMapper type={"oslayer"}></IconMapper>
  };

  return (
    <Link key={title} to={slug}>
      <div className={styles.card}>
          <PackCardIcon title={title} logoUrl={logoUrl} type={type}/>
        <div className={styles.title}>{title}</div>
      </div>
    </Link>
  );
}
