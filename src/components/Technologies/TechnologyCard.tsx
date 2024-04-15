import React from "react";
import { useHistory } from "react-router-dom";
import styles from "./Technologies.module.scss";
import PackCardIcon from "./PackCardIcon";

interface TechnologyCardProps {
  name: string;
  title: string;
  logoUrl: string;
  type: string;
}

export default function TechnologyCard({ name, title, logoUrl, type }: TechnologyCardProps) {
  const history = useHistory();
  const handleImageError = (e: any) => {
    console.log(`Failed to load e.target.src: ${e.target.src}`);
    e.target.src.display = "none"
  };
  const handleClick = () => {
    history.push({
      pathname: `/integrations/packs/${name}`,
    });
  };

  return (
    <div className={styles.card} onClick={() => handleClick()}>
      <PackCardIcon title={title} logoUrl={logoUrl} type={type} />
      <div className={styles.title}>{title}</div>
    </div>
  );
}
