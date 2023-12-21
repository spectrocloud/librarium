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
      items: (() => {
        try {
          return require("./docs/api-content/api-docs/v1/sidebar.ts");
        } catch (error) {
          console.log(error);
          return [];
        }
      })(),
    },
  ],
};
