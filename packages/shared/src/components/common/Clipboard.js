import React from "react";
import ClipboardJS from "clipboard";

function Clipboard({ type, children }) {

  const text = children.props.children.props.children;
  console.log(text);
  return (
    <div>
      {children}
    </div>
  );
}

export default Clipboard;
