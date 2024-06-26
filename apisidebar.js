// const paletteAPIVersions = [ // { // version: "1.0.0", // label: "V1", // baseUrl: "/api/introduction", // }, // ];

// const { // versionSelector, // versionCrumb, // } = require("docusaurus-plugin-openapi-docs/lib/sidebars/utils");

const fs = require("fs");
const sidebarFilePath = "./docs/api-content/api-docs/v1/sidebar.ts";

let sidebarItems = [];
if (fs.existsSync(sidebarFilePath)) {
  sidebarItems = require(sidebarFilePath);
}

let emcSidebarItems = [];
const sidebarEmcFilePath = "./docs/api-content/api-docs/edge-v1/sidebar.ts";
if (fs.existsSync(sidebarEmcFilePath)) {
  emcSidebarItems = require(sidebarEmcFilePath);
}

module.exports = {
  apiSidebar: [
    { type: "doc", id: "introduction", label: "Introduction" },
    { type: "doc", id: "samples", label: "Example Usage" },
    { type: "doc", id: "postman-collection", label: "Postman collection" },
    {
      type: "category",
      label: "Palette API V1",
      link: { type: "generated-index", title: "Palette API V1" },
      items: sidebarItems,
    },
    {
      type: "category",
      label: "Edge Management API V1",
      link: { type: "generated-index", title: "Edge Management API V1" },
      items: emcSidebarItems,
    },
  ],
};
