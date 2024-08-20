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

type ImageModule = {
  default: string;
};

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
          const module: ImageModule = await import(`/static/img/packs/${logoUrl}`);
          setIcon(<Image img={module.default} />);
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

    // Explicitly mark the promise as intentionally unhandled
    void loadIcon();
  }, [logoUrl, appType, type]);

  return <div className={`${className} ${styles.imageWrapper}`}>{icon}</div>;
}
