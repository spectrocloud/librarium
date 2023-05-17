const React = require("react");
const Persistent = require("./src/shared/layouts/Persistent").default;

module.exports.wrapRootElement = ({ element, props }) => {
  return <Persistent {...props}>{element}</Persistent>;
};
