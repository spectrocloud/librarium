import React, { useRef, useEffect } from "react";
import styled, { css } from "styled-components";
import ClipboardJS from "clipboard";
import { CopyOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import CodeBlock from "./codeBlock";
import AnchorTag from "./anchor";

import { useTabsContext } from "shared/components/ui/Tabs";

const PreContainer = styled.div`
  position: relative;

  pre {
    max-height: 450px;
  }
`;

const VideoWrap = styled.div`
  max-width: 840px;
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

const HeaderWrap = styled.div`
  display: flex;
  align-items: center;
  padding-left: 26px;
  margin-left: -26px;

  > a {
    visibility: hidden;
    margin-left: -30px;
    margin-right: 10px;
    text-decoration: none;
    color: rgba(0, 0, 0, 0.85);

    :hover {
      color: rgba(0, 0, 0, 0.85);
    }
  }

  :hover {
    > a {
      visibility: visible;
    }
  }
`;

function Pre(props) {
  const preRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    new ClipboardJS(buttonRef.current, {
      text: (trigger) => {
        return preRef.current.innerText;
      },
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

function generatePermalinkAnchor(children, tabsIdentifierData) {
  const headingId = generateHeadingId(children);

  if (tabsIdentifierData?.id) {
    return `?${tabsIdentifierData.id}=${tabsIdentifierData.activeKey}#${headingId}`;
  }

  return `#${headingId}`;
}

function generateHeadingId(children) {
  let title = children;

  if (Array.isArray(children)) {
    title = children.reduce((accumulator, child) => {
      if (typeof child === "string") {
        return `${accumulator} ${child}`;
      }
      if (child?.props?.children) {
        return `${accumulator} ${generateHeadingId(child.props.children)}`;
      }

      return accumulator;
    }, "");
  }

  return title.replace(/\s+/g, "").toLowerCase();
}

export default {
  h1: (props) => {
    const tabsIdentifierData = useTabsContext();

    return (
      <HeaderWrap>
        <a href={generatePermalinkAnchor(props.children, tabsIdentifierData)}>
          <FontAwesomeIcon icon="link" />
        </a>
        <h1 id={generateHeadingId(props.children)} {...props} />
      </HeaderWrap>
    );
  },
  h2: (props) => {
    const tabsIdentifierData = useTabsContext();

    return (
      <HeaderWrap>
        <a href={generatePermalinkAnchor(props.children, tabsIdentifierData)}>
          <FontAwesomeIcon icon="link" />
        </a>
        <h2 id={generateHeadingId(props.children)} {...props} />
      </HeaderWrap>
    );
  },
  h3: (props) => <h3 id={generateHeadingId(props.children)} {...props} />,
  h4: (props) => <h4 id={generateHeadingId(props.children)} {...props} />,
  h5: (props) => <h5 id={generateHeadingId(props.children)} {...props} />,
  h6: (props) => <h6 id={generateHeadingId(props.children)} {...props} />,
  p: (props) => <p className="paragraph" {...props} />,
  pre: Pre,
  code: CodeBlock,
  a: AnchorTag,
  img: (props) => {
    return <img {...props} />;
  },
  // TODO add `blockquote`
  // TODO add `ul`
  // TODO add `li`
  // TODO add `table`
};
