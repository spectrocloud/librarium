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
  const [icon, setIcon] = useState<ReactElement<any, any> | null>(null);
  useEffect(() => {
    if (logoUrl) {
      import(`@site/.docusaurus/packs-integrations/${logoUrl}`).then((image) => {
        setIcon(<Image preview={false} img={image.default}/>)
      }).catch((e) => {
        setIcon(<IconMapper type={type} />);
      });
    }
  },[logoUrl]);

  return (
    <div className={`${className} ${styles.imageWrapper}`}>
      {icon ? icon : <IconMapper type={type} />}
    </div>
  );
}
