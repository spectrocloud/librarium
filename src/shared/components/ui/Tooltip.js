import React from "react";
import { Tooltip as AntdTooltip } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Tooltip({
  icon = "info-circle",
  trigger = <FontAwesomeIcon icon={icon} />,
  children,
  ...rest
}) {
  return (
    <AntdTooltip color="#091e3b" title={children} {...rest}>
      {trigger}
    </AntdTooltip>
  );
}
