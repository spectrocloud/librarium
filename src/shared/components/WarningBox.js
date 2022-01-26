import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Box from "./Box";

function WarningBox({ ...props }) {
  return <Box type="warning" {...props} />;
}

export default WarningBox;
