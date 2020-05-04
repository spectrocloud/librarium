import React from "react";
import { library } from '@fortawesome/fontawesome-svg-core';
import {fas} from "@fortawesome/free-solid-svg-icons";

import DefaultThemeProvider from "./theme";
import DefaultMdxProvider from "./mdx";

library.add(fas)

export default function createDocsApp({
  ThemeProvider = DefaultThemeProvider,
  MdxProvider = DefaultMdxProvider
}) {
  function App({children}) {
    return (
      <ThemeProvider>
        <MdxProvider>
          {children}
        </MdxProvider>
      </ThemeProvider>
    );
  }

  return App;
}
