const componentWithMDXScope = require('gatsby-plugin-mdx/component-with-mdx-scope');

const path = require('path');

const startCase = require('lodash.startcase');

const config = require('./config');

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  return new Promise((resolve, reject) => {
    resolve(
      graphql(
        `
          {
            allMdx {
              edges {
                node {
                  fields {
                    id
                  }
                  tableOfContents
                  fields {
                    slug
                  }
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors); // eslint-disable-line no-console
          reject(result.errors);
        }

        // Create blog posts pages.
        result.data.allMdx.edges.forEach(({ node }) => {
          createPage({
            path: node.fields.slug ? node.fields.slug : '/',
            component: path.resolve('./src/templates/docs.js'),
            context: {
              id: node.fields.id,
            },
          });
        });
      })
    );
  });
};

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
      alias: {
        $components: path.resolve(__dirname, 'src/components'),
        buble: '@philpl/buble', // to reduce bundle size
      },
    },
  });
};

exports.onCreateBabelConfig = ({ actions }) => {
  actions.setBabelPlugin({
    name: '@babel/plugin-proposal-export-default-from',
  });
};

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `Mdx`) {
    const parent = getNode(node.parent);

    let value = parent.relativePath.replace(parent.ext, '');

    const slugs = value.split('/').map((slugPart, index, slugs) => {
      const [_, ...rest] = slugPart.split('-')
      if (index === slugs.length - 1) {
        createNodeField({
          name: `index`,
          node,
          value: _
        });
      }

      if (rest.length === 0) {
        return _;
      }

      return rest.join('-')
    })

    value = slugs.join('/');
    if (value === 'index') {
      value = '';
    }

    if (config.gatsby && config.gatsby.trailingSlash) {
      createNodeField({
        name: `slug`,
        node,
        value: value === '' ? `/` : `/${value}/`,
      });
    } else {
      createNodeField({
        name: `slug`,
        node,
        value: `/${value}`,
      });
    }

    createNodeField({
      name: 'id',
      node,
      value: node.id,
    });

    createNodeField({
      name: 'title',
      node,
      value: node.frontmatter.title || startCase(parent.name),
    });

    createNodeField({
      name: 'icon',
      node,
      value: node.frontmatter.icon,
    });

    createNodeField({
      name: 'hiddenFromNav',
      node,
      value: node.frontmatter.hiddenFromNav,
    });

    createNodeField({
      name: 'hideToC',
      node,
      value: node.frontmatter.hideToC,
    });

    createNodeField({
      name: 'fullWidth',
      node,
      value: node.frontmatter.fullWidth,
    });

    createNodeField({
      name: 'isIntegration',
      node,
      value: node.frontmatter.isIntegration,
    });

    createNodeField({
      name: 'category',
      node,
      value: node.frontmatter.category,
    });

    createNodeField({
      name: 'logoUrl',
      node,
      value: node.frontmatter.logoUrl,
    });
  }
};
