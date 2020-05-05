import React from "react";
import { MDXProvider } from '@mdx-js/react';
import mdxComponents from "./components"

export default function MdxProvider({ children }) {
  return <MDXProvider components={mdxComponents}>{children}</MDXProvider>;
}
