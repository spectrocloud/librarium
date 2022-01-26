import React from "react";
import { Sidebar, ListItem } from "./styles/Sidebar";
import { useLocation } from "@reach/router";
import config from "../../../config";

const TableOfContents = ({ edges }) => {
  const location = useLocation();

  let finalNavItems = [];
  if (edges !== undefined && edges.length > 0) {
    edges.forEach((item, index) => {
      let innerItems;

      if (item !== undefined) {
        const pathname = location && location.pathname;
        const hash = location && location?.hash;
        if (
          item.node.fields.slug === pathname ||
          item.node.fields.slug === config.gatsby.pathPrefix + pathname
        ) {
          if (item.node.tableOfContents.items) {
            innerItems = item.node.tableOfContents.items.map((innerItem, index) => {
              const itemId = innerItem.title
                ? innerItem.title.replace(/\s+/g, "").toLowerCase()
                : "#";

              return (
                <ListItem key={index} to={`#${itemId}`} level={1} active={hash === `#${itemId}`}>
                  {innerItem.title}
                </ListItem>
              );
            });
          }
        }
      }
      if (innerItems) {
        finalNavItems = innerItems;
      }
    });
  }

  if (finalNavItems && finalNavItems.length) {
    return (
      <Sidebar>
        <ul className={"rightSideBarUL"}>
          <li className={"rightSideTitle"}>CONTENTS</li>
          {finalNavItems}
        </ul>
      </Sidebar>
    );
  } else {
    return null;
  }
};

export default TableOfContents;
