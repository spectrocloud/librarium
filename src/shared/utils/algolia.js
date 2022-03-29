const config = require("../../../config.js");

const pageQuery = `{
  pages: allMdx {
    edges {
      node {
        objectID: id
        parent {
          ... on File {
            modifiedTime(formatString: "MM/DD/YYYY")
          }
        }
        fields {
          slug
          isApiPage
          isDocsPage
        }
        headings {
          value
        }
        frontmatter {
          title
          metaDescription
        }
        excerpt(pruneLength: 5000)
      }
    }
  }
}`;

const flatten = (arr) =>
  arr.map(({ node: { frontmatter, fields, parent, ...rest } }) => ({
    ...frontmatter,
    ...fields,
    ...rest,
    ...parent,
  }));

const settings = { attributesToSnippet: [`excerpt:20`] };

const indexName = config.header.search ? config.header.search.indexName : "";

const queries = [
  {
    query: pageQuery,
    transformer: ({ data }) => {
      return flatten(data.pages.edges).filter((edge) => edge.isApiPage || edge.isDocsPage);
    },
    indexName: `${indexName}`,
    settings,
  },
];

module.exports = queries;
