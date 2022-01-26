const componentWithMDXScope = require("gatsby-plugin-mdx/component-with-mdx-scope");
const path = require("path");
const startCase = require("lodash.startcase");

const config = require("./config");

exports.createPages = async ({ graphql, actions }) => {
  const { createPage, createRedirect } = actions;

  createRedirect({
    fromPath: `/api/`,
    toPath: `/api/introduction`,
    redirectInBrowser: true,
    isPermanent: true,
  });

  createRedirect({
    fromPath: `/api`,
    toPath: `/api/introduction`,
    redirectInBrowser: true,
    isPermanent: true,
  });

  const result = await graphql(`
    {
      allMdx {
        edges {
          node {
            fields {
              id
              isDocsPage
              slug
            }
          }
        }
      }
    }
  `);

  result.data.allMdx.edges.forEach(({ node }) => {
    if (node.fields.slug === "/glossary") {
      return;
    }

    let component = path.resolve("./src/templates/docs.js");
    // if (node.fields.slug.startsWith('/glossary')) {
    //   component = path.resolve('../glossary/src/templates/docs.js');
    // }

    if (node.fields.slug.startsWith("/api")) {
      component = path.resolve("./src/templates/api.js");
    }

    const slug = node.fields.slug ? node.fields.slug : "/";

    // Disable glossary pages
    if (node.fields.slug.startsWith("/glossary/")) {
      return;
    }

    createPage({
      path: slug,
      component,
      context: {
        id: node.fields.id,
      },
    });
  });
};

exports.onCreateWebpackConfig = ({ actions, getConfig }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, "src"), "node_modules"],
      alias: {
        $components: path.resolve(__dirname, "src/components"),
        buble: "@philpl/buble", // to reduce bundle size
      },
    },
  });
};

exports.onCreateBabelConfig = ({ actions }) => {
  actions.setBabelPlugin({
    name: "@babel/plugin-proposal-export-default-from",
  });
};

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `Mdx`) {
    const isDocsPage = !!node.fileAbsolutePath.includes("/content/docs/");
    const isApiPage = !!node.fileAbsolutePath.includes("/content/api/");
    const parent = getNode(node.parent);

    let value = parent.relativePath.replace(parent.ext, "");

    const slugs = value.split("/").map((slugPart, index, slugs) => {
      const [_, ...rest] = slugPart.split("-");
      if (index === slugs.length - 1) {
        createNodeField({
          name: `index`,
          node,
          value: _,
        });
      }

      if (rest.length === 0) {
        return _;
      }

      return rest.join("-");
    });

    value = slugs.join("/");
    if (value === "index") {
      value = "";
    }

    let prefix = "/glossary";
    if (isDocsPage) {
      prefix = "";
    }

    if (isApiPage) {
      prefix = "/api";
    }

    createNodeField({
      name: `slug`,
      node,
      value: `${prefix}/${value}`,
    });

    createNodeField({
      name: "id",
      node,
      value: node.id,
    });

    createNodeField({
      name: "title",
      node,
      value: node.frontmatter.title || startCase(parent.name),
    });

    createNodeField({
      name: "icon",
      node,
      value: node.frontmatter.icon,
    });

    createNodeField({
      name: "hiddenFromNav",
      node,
      value: node.frontmatter.hiddenFromNav,
    });

    createNodeField({
      name: "hideToC",
      node,
      value: node.frontmatter.hideToC,
    });

    createNodeField({
      name: "hideToCSidebar",
      node,
      value: node.frontmatter.hideToCSidebar,
    });

    createNodeField({
      name: "fullWidth",
      node,
      value: node.frontmatter.fullWidth,
    });

    createNodeField({
      name: "isDocsPage",
      node,
      value: isDocsPage,
    });

    createNodeField({
      name: "isApiPage",
      node,
      value: isApiPage,
    });

    createNodeField({
      name: "isIntegration",
      node,
      value: node.frontmatter.isIntegration,
    });

    createNodeField({
      name: "category",
      node,
      value: node.frontmatter.category,
    });

    createNodeField({
      name: "logoUrl",
      node,
      value: node.frontmatter.logoUrl,
    });

    createNodeField({
      name: "api",
      node,
      value: node.frontmatter.api,
    });

    createNodeField({
      name: "hideMenuSidebar",
      node,
      value: node.frontmatter.hideMenuSidebar,
    });

    if (node.frontmatter.api) {
      const fileAbsolutePaths = node.fileAbsolutePath.split("/content/api/");
      const versionDirectory = fileAbsolutePaths[1].split("/").shift();
      const endpointsPath = [
        fileAbsolutePaths[0],
        "api",
        "content",
        versionDirectory,
        "api.json",
      ].join("/");

      createNodeField({
        name: "version",
        node,
        value: versionDirectory,
      });
    }
  }
};
