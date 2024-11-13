// src/components/AccordionPanel.tsx
import React, { ReactNode } from "react";

interface AccordionPanelProps {
  title: string;
  children: ReactNode;
}

const AccordionPanel: React.FC<AccordionPanelProps> = ({ children }) => {
  return <>{children}</>;
};

export default AccordionPanel;
