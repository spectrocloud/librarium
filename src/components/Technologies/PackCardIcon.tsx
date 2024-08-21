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
  // Declare a state variable 'icon' with an initial value of null,
  // which will store the React element to be rendered as the icon.

  useEffect(() => {
    if (logoUrl) {
      // Check if 'logoUrl' is provided.
      try {
        if (appType === "app") {
          // If 'appType' is "app", set the icon to an img element with the 'logoUrl' as the source.
          setIcon(<img src={logoUrl} />);
        } else {
          // Otherwise, set the icon to an Image component, requiring the image from a specific path.
          setIcon(<Image img={require(`/static/img/packs/${logoUrl}`)} />);
        }
      } catch (e) {
        // If an error occurs (e.g., the image cannot be found), fall back to the IconMapper component.
        type ? setIcon(<IconMapper type={type} />) : setIcon(null);
      }
    } else {
      // If no 'logoUrl' is provided, fall back to rendering an icon based on the 'type' prop.
      type ? setIcon(<IconMapper type={type} />) : setIcon(null);
    }
  }, [logoUrl]);
  // The useEffect hook is triggered whenever 'logoUrl' changes.

  return <div className={`${className} ${styles.imageWrapper}`}>{icon}</div>;
  // Return a div containing the icon, with a combination of the provided 'className' and
  // a CSS class from the imported styles.
}
