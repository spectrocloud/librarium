import * as React from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import prismTheme from "prism-react-renderer/themes/oceanicNext";
import Loadable from "react-loadable";
import LoadingProvider from "./loading";

/** Removes the last token from a code example if it's empty. */
function cleanTokens(tokens) {
  const tokensLength = tokens.length;

  if (tokensLength === 0) {
    return tokens;
  }
  const lastToken = tokens[tokensLength - 1];

  if (lastToken.length === 1 && lastToken[0].empty) {
    return tokens.slice(0, tokensLength - 1);
  }
  return tokens;
}

const LoadableComponent = Loadable({
  loader: () => import("./LiveProvider"),
  loading: LoadingProvider,
});

/* eslint-disable react/jsx-key */
const CodeBlock = ({ children: exampleCode, ...props }) => {
  const lineHighlightDefaultColor = '#666666'
  const language = props?.className?.split("language-")?.[1] || "json";
  if (props["react-live"]) {
    return <LoadableComponent code={exampleCode} />;
  } else {
    const coloredIntervals = {};

    if (props.coloredLines) {
      const iterations = props.coloredLines.split(",");
      iterations.forEach((iteration) => {
        const range = iteration.split("|")[0];
        // Always set color to #666666, regardless of whether "|" exists. This is to ensure consitency.
        coloredIntervals[range] = lineHighlightDefaultColor;
      });
    }

    return (
      <Highlight {...defaultProps} code={exampleCode} language={language} theme={prismTheme}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={className + " pre"}
            style={{
              ...style,
              borderRadius: "6px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
              padding: "16px",
              fontSize: "14px",
            }}
            p={3}
          >
            {cleanTokens(tokens).map((line, i) => {
              let lineClass = {
                padding: "5px",
                margin: "0 -5px",
              };

              const intervalKey = Object.keys(coloredIntervals).find((interval) => {
                const [lower, upper] = interval.split("-");
                const index = i + 1;
                return index >= parseInt(lower) && index <= parseInt(upper);
              });

              if (intervalKey) {
                lineClass.backgroundColor = coloredIntervals[intervalKey];
              }

              let isDiff = false;

              if (line[0] && line[0].content.length && line[0].content[0] === "+") {
                lineClass = { backgroundColor: "rgba(76, 175, 80, 0.2)" };
                isDiff = true;
              } else if (line[0] && line[0].content.length && line[0].content[0] === "-") {
                lineClass = { backgroundColor: "rgba(244, 67, 54, 0.2)" };
                isDiff = true;
              } else if (line[0] && line[0].content === "" && line[1] && line[1].content === "+") {
                lineClass = { backgroundColor: "rgba(76, 175, 80, 0.2)" };
                isDiff = true;
              } else if (line[0] && line[0].content === "" && line[1] && line[1].content === "-") {
                lineClass = { backgroundColor: "rgba(244, 67, 54, 0.2)" };
                isDiff = true;
              }
              const lineProps = getLineProps({ line, key: i });

              lineProps.style = lineClass;
              const diffStyle = {
                userSelect: "none",
                MozUserSelect: "-moz-none",
                WebkitUserSelect: "none",
              };

              let splitToken;

              return (
                <div {...lineProps} key={line + i}>
                  {line.map((token, key) => {
                    if (isDiff) {
                      if (
                        (key === 0 || key === 1) &
                        (token.content.charAt(0) === "+" || token.content.charAt(0) === "-")
                      ) {
                        if (token.content.length > 1) {
                          splitToken = {
                            types: ["template-string", "string"],
                            content: token.content.slice(1),
                          };
                          const firstChar = {
                            types: ["operator"],
                            content: token.content.charAt(0),
                          };

                          return (
                            <React.Fragment key={token + key}>
                              <span
                                {...getTokenProps({ token: firstChar, key })}
                                style={diffStyle}
                              />
                              <span {...getTokenProps({ token: splitToken, key })} />
                            </React.Fragment>
                          );
                        } else {
                          return <span {...getTokenProps({ token, key })} style={diffStyle} />;
                        }
                      }
                    }
                    return <span {...getTokenProps({ token, key })} />;
                  })}
                </div>
              );
            })}
          </pre>
        )}
      </Highlight>
    );
  }
};

export default CodeBlock;
