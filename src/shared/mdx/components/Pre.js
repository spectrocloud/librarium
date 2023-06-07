import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import ClipboardJS from "clipboard";
import { CopyOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

const ButtonWrapper = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
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

const PreContainer = styled.div`
  position: relative;

  pre {
    max-height: 450px;
  }
`;

export default function Pre(props) {
  const preRef = useRef(null);
  const buttonRef = useRef(null);
  const hideClipboard = props?.children?.props?.hideClipboard || false;
  useEffect(() => {
    if (!hideClipboard && buttonRef.current) {
      new ClipboardJS(buttonRef.current, {
        text: (trigger) => {
          return preRef.current.innerText;
        },
      });
    }
  }, [hideClipboard]);

  return (
    <PreContainer>
      <div ref={preRef} {...props} />
      {!hideClipboard && (
        <ButtonWrapper>
          <Tooltip title="Copy to clipboard" placement="top">
            <Copy ref={buttonRef}>
              <CopyOutlined />
            </Copy>
          </Tooltip>
        </ButtonWrapper>
      )}
    </PreContainer>
  );
}
