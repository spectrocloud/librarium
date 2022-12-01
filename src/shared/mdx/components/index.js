import React, { useRef, useEffect } from "react";
import styled from "styled-components";
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
  video {
    width: 100%;
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

const Anchor = styled.div`
  position: absolute;
  top: -120px;
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

const Header1 = (props) => {
  const tabsIdentifierData = useTabsContext();

  return (
    <HeaderWrap>
      <a href={generatePermalinkAnchor(props.children, tabsIdentifierData)}>
        <FontAwesomeIcon icon="link" />
      </a>
      <h1 {...props}>
        {props.children}
        <Anchor id={generateHeadingId(props.children)} />
      </h1>
    </HeaderWrap>
  );
};

const Header2 = (props) => {
  const tabsIdentifierData = useTabsContext();

  return (
    <HeaderWrap>
      <a href={generatePermalinkAnchor(props.children, tabsIdentifierData)}>
        <FontAwesomeIcon icon="link" />
      </a>
      <h2 {...props}>
        {props.children}
        <Anchor id={generateHeadingId(props.children)} />
      </h2>
    </HeaderWrap>
  );
};

const Header3 = (props) => {
  const tabsIdentifierData = useTabsContext();

  return (
    <HeaderWrap>
      <a href={generatePermalinkAnchor(props.children, tabsIdentifierData)}>
        <FontAwesomeIcon icon="link" />
      </a>
      <h3 {...props}>
        {props.children}
        <Anchor id={generateHeadingId(props.children)} />
      </h3>
    </HeaderWrap>
  );
};

const mdxComponents = {
  h1: Header1,
  h2: Header2,
  h3: Header3,
  h4: (props) => (
    <h4 id={generateHeadingId(props.children)} {...props}>
      {props.children}
    </h4>
  ),
  h5: (props) => (
    <h5 id={generateHeadingId(props.children)} {...props}>
      {" "}
      {props.children}
    </h5>
  ),
  h6: (props) => (
    <h6 id={generateHeadingId(props.children)} {...props}>
      {props.children}
    </h6>
  ),
  p: (props) => <p className="paragraph" {...props} />,
  pre: Pre,
  code: CodeBlock,
  a: AnchorTag,
  img: (props) => {
    return <img alt="MDXimage" {...props} />;
  },
  video: (props) => (
    <VideoWrap>
      <video {...props}>
        <track default kind="captions" srcLang="en" />
      </video>
    </VideoWrap>
  ),
  // TODO add `blockquote`
  // TODO add `ul`
  // TODO add `li`
  // TODO add `table`
};

export default mdxComponents;
