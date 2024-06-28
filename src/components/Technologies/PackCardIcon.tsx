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
    if (logoUrl) {
      try {
        if(appType === "app") {
          setIcon(<img src={logoUrl} />);
        } else {
          setIcon(<Image img={require(`/static/img/packs/${logoUrl}`)} />);
        }
      } catch (e) {
        type ? setIcon(<IconMapper type={type} />) : setIcon(null)
      }
    } else {
      type ? setIcon(<IconMapper type={type} />) : setIcon(null)
    }
  }, [logoUrl]);

  return (
    <div className={`${className} ${styles.imageWrapper}`}>
      {icon}
    </div>
  );
}
