import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Box from "./Box";

function InfoBox({...props}) {
  return <Box type="info" {...props} />
}

export default InfoBox;
