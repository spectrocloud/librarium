/* eslint-disable */
import React, { useState, useEffect, ReactElement } from "react";
import styles from "./PackCardIcon.module.scss";
import IconMapper from "@site/src/components/IconMapper/IconMapper";
import Image from "@theme/IdealImage";

interface PackCardIconProps {
  appType?: string;
  logoUrl?: string;
  type?: any;
  className?: any;
}

export default function PackCardIcon({ appType, logoUrl, type, className }: PackCardIconProps) {
  const [icon, setIcon] = useState<ReactElement | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      if (logoUrl) {
        try {
          if (appType === "app") {
            setIcon(<img src={logoUrl} />);
          } else {
            const img = (await import(`/static/img/packs/${logoUrl}`)).default;
            setIcon(<Image img={img} />);
          }
        } catch (e) {
          console.error("Error loading pack icon image", e);
          type = type ? setIcon(<IconMapper type={type} />) : setIcon(null);
        }
      } else {
        type = type ? setIcon(<IconMapper type={type} />) : setIcon(null);
      }
    };

    loadImage();
  }, [logoUrl]);

  return <div className={`${className} ${styles.imageWrapper}`}>{icon}</div>;
}
