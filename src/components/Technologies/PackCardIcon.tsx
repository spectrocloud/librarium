import React, { useState } from "react";
import styles from "./PackCardIcon.module.scss";
import IconMapper from "@site/src/components/IconMapper/IconMapper";
import { Image } from "antd";

interface PackCardIconProps {
  title: string;
  logoUrl: string;
  type: string;
}

export default function PackCardIcon({ title, logoUrl, type }: PackCardIconProps) {
  const [ isError, setIsError ] = useState(false);
  console.log("type", type, "  title ", title);
  const handleImageError = (e: any) => {
    console.log(`Failed to load e.target.src: ${e.target.src}`);
    e.target.style.display = "none";
    setIsError(true);
    //<IconMapper type={"oslayer"}></IconMapper>
  };

  return (
    <div className={styles.imageWrapper}>
      {isError ?(<IconMapper type={type} />) :
      (<Image
        height={52}
        src={logoUrl}
        alt={`${title} logo`}
        onError={handleImageError}
      />)
      }
    </div>
  );
}
