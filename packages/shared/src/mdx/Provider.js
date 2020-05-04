import React from "react";
import mdxComponents from "./components"

export default function MdxProvider({ children }) {
  return <MDXProvider components={mdxComponents}>{children}</MDXProvider>;
}
