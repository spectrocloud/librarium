import React, { useReducer, useContext } from "react";
import reducer, { initialState } from "./reducer";

const Context = React.createContext();

const Provider = (props) => {
  const value = useReducer(reducer, initialState);

  return <Context.Provider value={value}>{props.children}</Context.Provider>;
};

const useSetupContext = () => {
  return useContext(Context);
};

export { useSetupContext };
export default Provider;
