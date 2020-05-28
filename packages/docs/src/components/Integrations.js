import React from "react";

function Integrations(props) {
  console.log(props.data);
  return <div>
    <span>Integrations</span>
    {props.data.map(pack => <div>{pack.packName}</div>)}
  </div>
}

export default Integrations;
