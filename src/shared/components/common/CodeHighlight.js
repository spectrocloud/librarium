import React from "react";
import Highlight, { defaultProps } from 'prism-react-renderer';
import prismTheme from 'prism-react-renderer/themes/nightOwlLight';
import styled from "styled-components";

import DeprecatedTag from "shared/components/common/DeprecatedTag"

const StyledDeprecatedTag = styled(DeprecatedTag)`
  margin-left: 5px;
`;

function CodeHighlight({ code, language = "json", theme=prismTheme }) {
  return (
    <Highlight {...defaultProps} code={code} language={language} theme={theme}>
      {({ className, style, tokens, getLineProps, getTokenProps }) =>
        {
        return (<pre className={className} style={style}>
          {tokens.map((line, i) => {
            const deprecatedLineIndex = line.findIndex(token => token.content.includes("deprecated"));
            if(deprecatedLineIndex >= 0) {
              const content = line[deprecatedLineIndex].content;
              line[deprecatedLineIndex].content = content.substring(0, content.length - 12) + '"';
              line.splice(deprecatedLineIndex + 2, 0, {content: "deprecated", types: ["string"]});
            }
            return (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                  token.content === "deprecated" ?
                  <StyledDeprecatedTag />:
                  <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          )})}
        </pre>)
          }
      }
    </Highlight>
  )
}

export default CodeHighlight;
