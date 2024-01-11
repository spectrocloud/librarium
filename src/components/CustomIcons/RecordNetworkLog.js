import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle as faCircleReg } from '@fortawesome/free-regular-svg-icons';
import { faCircle as faCircleSol } from '@fortawesome/free-solid-svg-icons';

const RecordNetworkLog = () => {
    return (
      <span class="fa-layers fa-fw">
        <FontAwesomeIcon icon={faCircleReg} />
        <FontAwesomeIcon icon={faCircleSol} fontSize={8} />
      </span>
    )
}

export default RecordNetworkLog;