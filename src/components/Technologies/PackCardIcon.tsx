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
    const loadIcon = async () => {
      if (logoUrl && appType === "app") {
        setIcon(<img src={logoUrl} />);
        return;
      }

      if (logoUrl) {
        try {
          const img = (await import(`/static/img/packs/${logoUrl}`)).default;
          setIcon(<Image img={img} />);
          return;
        } catch (e) {
          console.error(e);
        }
      }

      if (type) {
        setIcon(<IconMapper type={type} />);
      } else {
        setIcon(null);
      }
    };

    loadIcon();
  }, [logoUrl, appType, type]);

  return <div className={`${className} ${styles.imageWrapper}`}>{icon}</div>;
}
