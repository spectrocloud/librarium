import React, { useState } from "react";
import styles from "./PackCardIcon.module.scss";
import IconMapper from "@site/src/components/IconMapper/IconMapper";
import { Image } from "antd";

interface PackCardIconProps {
  title?: string;
  logoUrl?: string;
  type?: any;
  className?: any;
}

export default function PackCardIcon({ title, logoUrl, type, className }: PackCardIconProps) {
  const [isError, setIsError] = useState(false);
  const handleImageError = (e: any) => {
    setIsError(true);
  };

  return (
    <div className={`${className} ${styles.imageWrapper}`}>
      {isError || !logoUrl ? (<IconMapper type={type} />) :
        (<Image
          preview={false}
          src={logoUrl}
          alt={`${title} logo`}
          onError={handleImageError}
        />)
      }
    </div>
  );
}
