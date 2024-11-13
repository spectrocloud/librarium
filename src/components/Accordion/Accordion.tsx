// src/components/Accordion.tsx
import React, { ReactNode, ReactElement } from "react";
import { Collapse } from "antd";
import styles from "./Accordion.module.css";

// Define the expected props for AccordionPanel
interface AccordionPanelProps {
  title: string;
  children: ReactNode;
}

interface AccordionProps {
  children: ReactNode[];
}

const Accordion: React.FC<AccordionProps> = ({ children }) => {
  const mappedItems = React.Children.map(children, (child) => {
    if (React.isValidElement<AccordionPanelProps>(child) && child.props.title) {
      return {
        key: child.props.title,
        label: child.props.title,
        children: <div className={styles.content}>{child.props.children}</div>,
      };
    }
    return null;
  });

  // To avoid issues - let's remove any null items or undefined items
  const items = mappedItems?.filter((item): item is NonNullable<typeof item> => item !== null) ?? [];

  return <Collapse className={styles.accordion} items={items} />;
};

export default Accordion;
