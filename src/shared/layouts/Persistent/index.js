import React from "react";
import Provider from "./provider";

const Persistent = ({ children }) => <Provider>{children}</Provider>;
export default Persistent;
