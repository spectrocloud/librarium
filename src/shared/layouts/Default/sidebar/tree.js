import React from "react";
import TreeNode from "./treeNode";

const Tree = ({ menu }) => {
  return menu?.items?.map((menuItem, index) => <TreeNode {...menuItem} key={index} />) || null;
};

export default Tree;
