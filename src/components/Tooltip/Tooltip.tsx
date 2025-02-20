import React from "react";
import { Tooltip as AntdTooltip } from "antd";

interface TooltipProps {
  trigger: string;
  children: React.ReactNode;
}

export default function Tooltip(props: TooltipProps) {
  return (
    <AntdTooltip color="#012121" title={props.children}>
      {props.trigger}
    </AntdTooltip>
  );
}
