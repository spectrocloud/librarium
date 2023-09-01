import React from "react";
import SecondaryMenu from "@theme-original/Navbar/MobileSidebar/SecondaryMenu";
import type SecondaryMenuType from "@theme/Navbar/MobileSidebar/SecondaryMenu";
import type { WrapperProps } from "@docusaurus/types";
import PrimaryMenu from "../PrimaryMenu";
import styles from "./SecondaryMenu.module.scss";

type Props = WrapperProps<typeof SecondaryMenuType>;

export default function SecondaryMenuWrapper(props: Props): JSX.Element {
  return (
    <>
      <SecondaryMenu {...props} />
      <div className={styles.mobilePrimaryMenu}>
        <PrimaryMenu className={styles.mobileMenu}></PrimaryMenu>
      </div>
    </>
  );
}
