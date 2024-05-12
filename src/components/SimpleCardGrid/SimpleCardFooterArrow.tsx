import RightArrow from "/static/assets/icons/arrow-right-long.svg";
import styles from "./SimpleCardGrid.module.scss";
import React from "react";

interface FooterArrowProps {
  index?: number;
}
export default function SimpleCardFooterArrow({ index }: FooterArrowProps) {
  return <RightArrow className={styles.simpleCardFooterArrow} key={`simpleCardFooterArrow-${index}`} />;
}
