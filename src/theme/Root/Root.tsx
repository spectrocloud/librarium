import React from "react";
import MendableAIWidget from "../../components/MendableAIWidget";
import "antd/dist/antd.css";


export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MendableAIWidget></MendableAIWidget>
      {children}
    </>
  );
}
