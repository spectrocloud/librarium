import * as React from 'react';
import Link from "../../components/Link"

const AnchorTag = ({ children: link, ...props }) => {
  if (link) {
    return (
      <Link to={props.href} target="_blank" rel="noopener noreferrer">
        {link}
      </Link>
    );
  } else {
    return null;
  }
};

export default AnchorTag;
