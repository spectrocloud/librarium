import React, { useState } from "react";
import styles from "./PackCardIcon.module.scss";
import IconMapper from "@site/src/components/IconMapper/IconMapper";
import { Image } from "antd";

interface PackCardIconProps {
  title?: string;
  logoUrl?: string;
  type?: any;
}

export default function PackCardIcon({ title, logoUrl, type }: PackCardIconProps) {
  const [ isError, setIsError ] = useState(false);
  const handleImageError = (e: any) => {
    e.target.style.display = "none";
    setIsError(true);
  };

  return (
    <div className={styles.imageWrapper}>
      {isError ?(<IconMapper type={type} />) :
      (<Image
        preview={false}
        height={52}
        src={logoUrl}
        alt={`${title} logo`}
        onError={handleImageError}
      />)
      }
    </div>
  );
}
