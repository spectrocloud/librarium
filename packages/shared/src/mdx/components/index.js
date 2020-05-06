import React from 'react';
import styled from 'styled-components';

import CodeBlock from './codeBlock';
import AnchorTag from './anchor';

const StyledPre = styled.pre`
  padding: 16px;
  background: ${props => props.theme.colors.preFormattedText};
`;

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
  pre: props => (
    <StyledPre>
      <pre {...props} />
    </StyledPre>
  ),
  code: CodeBlock,
  a: AnchorTag,
  // TODO add `img`
  // TODO add `blockquote`
  // TODO add `ul`
  // TODO add `li`
  // TODO add `table`
};
