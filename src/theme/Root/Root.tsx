import React from "react";
import MendableAIWidget from "../../components/MendableAIWidget";

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MendableAIWidget></MendableAIWidget>
      {children}
    </>
  );
}
