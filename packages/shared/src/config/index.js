import React, {useContext, createContext} from "react";

//

const ConfigContext = createContext();

export function useConfig() {
  return useContext(ConfigContext);
}

export default function ConfigProvider({children, config = {}}) {
return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
}
