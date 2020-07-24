import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import ClipboardJS from "clipboard";
import { CopyOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

import CodeBlock from './codeBlock';
import AnchorTag from './anchor';

const PreContainer = styled.div`
  position: relative;

  pre {
    max-height: 450px;
  }
`;

const Copy = styled.button`
  opacity: 0.3;
  border-radius: 4px;
  background: #fefefe;
  overflow: hidden;
  border: none;
  transition: opacity 0.1s ease-in;

  :hover {
    opacity: 0.9;
  }
`;

const ButtonWrapper = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
`;

function Pre(props) {
  const preRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    new ClipboardJS(buttonRef.current, {
      text: (trigger) => {
        return preRef.current.innerText;
      }
    });
  }, []);

  return (
    <PreContainer>
      <div ref={preRef} {...props} />
      <ButtonWrapper>
        <Tooltip title="Copy to clipboard" placement="top">
          <Copy ref={buttonRef}>
            <CopyOutlined />
          </Copy>
        </Tooltip>
      </ButtonWrapper>
    </PreContainer>
  );
}

function generateHeadingId(children) {
  let title = children;
  if (Array.isArray(children)) {
    title = children.reduce((accumulator, child) => {
      if (typeof child === "string") {
        return `${accumulator} ${child}`
      }
      if (child?.props?.children) {
        return `${accumulator} ${generateHeadingId(child.props.children)}`
      }

      return accumulator;
    }, '')
  }

  return title.replace(/\s+/g, '').toLowerCase()
}

export default {
  h1: props => {
    return <h1 id={generateHeadingId(props.children)} {...props} />
  },
  h2: props => (
    <h2 id={generateHeadingId(props.children)} {...props} />
  ),
  h3: props => (
    <h3 id={generateHeadingId(props.children)} {...props} />
  ),
  h4: props => (
    <h4 id={generateHeadingId(props.children)} {...props} />
  ),
  h5: props => (
    <h5 id={generateHeadingId(props.children)} {...props} />
  ),
  h6: props => (
    <h6 id={generateHeadingId(props.children)} {...props} />
  ),
  p: props => <p className="paragraph" {...props} />,
  pre: Pre,
  code: CodeBlock,
  a: AnchorTag,
  // TODO add `img`
  // TODO add `blockquote`
  // TODO add `ul`
  // TODO add `li`
  // TODO add `table`
};
