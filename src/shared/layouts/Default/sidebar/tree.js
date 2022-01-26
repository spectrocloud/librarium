import React from "react";
import TreeNode from "./treeNode";

const Tree = ({ menu }) => {
  return menu?.items?.map((menuItem) => <TreeNode {...menuItem} />) || null;
};

export default Tree;
