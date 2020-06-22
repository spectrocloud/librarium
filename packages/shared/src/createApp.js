import React from "react";
import 'antd/dist/antd.css';
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

import DefaultThemeProvider from "./theme";
import DefaultMdxProvider from "./mdx";
import ConfigProvider from "./config";

library.add(fas);
// TODO add a config provider
export default function createDocsApp({
  ThemeProvider = DefaultThemeProvider,
  MdxProvider = DefaultMdxProvider,
  config,
} = {}) {

  function App({ children }) {
    return (
      <ConfigProvider config={config}>
        <ThemeProvider>
          <MdxProvider>{children}</MdxProvider>
        </ThemeProvider>
      </ConfigProvider>
    );
  }

  return App;
}
