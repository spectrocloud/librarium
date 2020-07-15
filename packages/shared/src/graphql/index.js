import React, {createContext, useContext} from 'react';

const Context = createContext();


export function useGraphQL() {
  return useContext(Context);
}

export default function GraphQLProvider({pageContext, children}) {
  return (
    <Context.Provider value={pageContext}>{children}</Context.Provider>
  )
};
