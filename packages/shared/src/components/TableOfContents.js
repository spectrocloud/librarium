import React from "react";
import { Sidebar, ListItem } from "./styles/Sidebar";
import { useConfig } from "../config";

const SidebarLayout = ({ edges, location }) => {
  const config = useConfig();

  let finalNavItems = [];
  if (edges !== undefined && edges.length > 0) {
    edges.forEach((item, index) => {
      let innerItems;

      if (item !== undefined) {
        const pathname = location && location.pathname;
        if (
          item.node.fields.slug === pathname ||
          config.gatsby.pathPrefix + pathname
        ) {
          if (item.node.tableOfContents.items) {
            innerItems = item.node.tableOfContents.items.map(
              (innerItem, index) => {
                const itemId = innerItem.title
                  ? innerItem.title.replace(/\s+/g, "").toLowerCase()
                  : "#";

                return (
                  <ListItem key={index} to={`#${itemId}`} level={1}>
                    {innerItem.title}
                  </ListItem>
                );
              }
            );
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

export default SidebarLayout;
