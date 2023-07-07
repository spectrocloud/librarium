import React from "react";
import Provider from "./provider";
import MendableAIWidget from "../../components/MendableAIWidget";

const Persistent = ({ children }) => {
  return (
    <Provider>
      <MendableAIWidget />
      {children}
    </Provider>
  );
};
export default Persistent;
