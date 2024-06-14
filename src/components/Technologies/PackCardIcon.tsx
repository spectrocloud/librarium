import React, { useState, useEffect, ReactElement } from "react";
import styles from "./PackCardIcon.module.scss";
import IconMapper from "@site/src/components/IconMapper/IconMapper";
import Image from "@theme/IdealImage";
interface PackCardIconProps {
  title?: string;
  logoUrl?: string;
  type?: any;
  className?: any;
}

export default function PackCardIcon({ title, logoUrl, type, className }: PackCardIconProps) {
  const [icon, setIcon] = useState<ReactElement >();
  useEffect(() => {
    if (logoUrl) {
      import(`@site/.docusaurus/packs-integrations/${logoUrl}`).then((image) => {
        setIcon(<Image img={image.default}/>)
      }).catch((e) => {
        setIcon(<IconMapper type={type} />);
      });
    } else {
      setIcon(<IconMapper type={type} />);
    }
  },[logoUrl]);

  return (
    <div className={`${className} ${styles.imageWrapper}`}>
      {icon}
    </div>
  );
}
