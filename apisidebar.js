// const paletteAPIVersions = [
//   {
//     version: "1.0.0",
//     label: "V1",
//     baseUrl: "/api/introduction",
//   },
// ];

// const {
//   versionSelector,
//   versionCrumb,
// } = require("docusaurus-plugin-openapi-docs/lib/sidebars/utils");

const fs = require("fs");
const sidebarFilePath = "./docs/api-content/api-docs/v1/sidebar.ts";

function loadSidebar(path) {
  if (!fs.existsSync(path)) return [];

  const mod = require(path);
  // Handle both CommonJS and ESM-style exports
  return Array.isArray(mod) ? mod : mod.default || [];
}

const sidebarItems = loadSidebar(sidebarFilePath);
// const sidebarEmcFilePath = "./docs/api-content/api-docs/edge-v1/sidebar.ts";
// const emcSidebarItems = loadSidebar(sidebarEmcFilePath);

module.exports = {
  apiSidebar: [
    {
      type: "doc",
      id: "introduction",
      label: "Introduction",
    },
    {
      type: "doc",
      id: "samples",
      label: "Example Usage",
    },
    {
      type: "doc",
      id: "postman-collection",
      label: "Postman collection",
    },
    {
      type: "category",
      label: "Palette API V1",
      link: {
        type: "generated-index",
        title: "Palette API V1",
      },
      items: sidebarItems,
    },
  ],
};
