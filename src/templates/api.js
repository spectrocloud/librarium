import React, { useMemo } from "react";
import { graphql } from "gatsby";
import Layout from "shared/layouts/Default";
import DocsLayout from "shared/layouts/Docs";
import ApiSidebar from "shared/components/common/ApiSidebar";
import Swagger from "shared/components/common/Swagger";

// TODO use graphql to get api.jsons
import v1 from "../../content/api/v1/api.json";

const APIS = {
  v1,
};

export default function MDXLayout({ data = {} }) {
  const {
    allMdx,
    mdx,
    site: {
      siteMetadata: { apiLocation },
    },
  } = data;

  const menu = useMemo(() => {
    return DocsLayout.calculateMenuTree(allMdx.edges, { base: "/api", trailingSlash: true });
  }, [allMdx.edges]);

  function renderAPIDoc() {
    // TODO refactor this function
    const paths = mdx.frontmatter?.paths;
    if (!paths || !mdx?.fields?.version) {
      return null;
    }

    const api = APIS[mdx?.fields?.version];

    function renderProperties(defObject) {
      // if there are no properties, render the format or type (this seems to apply only for timestamps)
      if (!defObject?.properties) {
        return defObject?.format || defObject.type;
      }

      return Object.keys(defObject?.properties).reduce((propertiesAcc, property) => {
        const definitionProperty = defObject.properties[property];
        const definitionPropertyRef = definitionProperty?.$ref || definitionProperty?.items?.$ref;

        const propertyName = definitionProperty?.description?.includes("Deprecated")
          ? `${property} deprecated`
          : property;
        // if the property contains a ref, call again extractDefinition
        if (definitionPropertyRef) {
          return {
            ...propertiesAcc,
            [propertyName]:
              definitionProperty.type === "array"
                ? [extractDefinition(definitionPropertyRef)]
                : extractDefinition(definitionPropertyRef),
          };
        } else {
          // if property value is an array, render what type the elements are
          if (definitionProperty.type === "array") {
            return {
              ...propertiesAcc,
              [propertyName]: [definitionProperty?.items.type || definitionProperty.type],
            };
          } else {
            // if the property value is an object that contains the properties key
            // call again renderProperties function in case it has refs inside
            // otherwise render the property type
            return {
              ...propertiesAcc,
              [propertyName]: definitionProperty?.properties
                ? renderProperties(definitionProperty)
                : definitionProperty.type,
            };
          }
        }
      }, {});
    }

    function extractDefinition(ref) {
      const definitionArray = ref?.split("/") || [];
      const def = definitionArray[definitionArray.length - 1];
      const defObject = api.definitions[def];

      // the response has no schema
      if (!defObject) {
        return null;
      }

      // the response schema is type array - encounter only 2 times and seems to always have the items prop
      if (defObject?.type === "array") {
        return {
          items: extractDefinition(defObject.items.$ref),
        };
      }

      return renderProperties(defObject);
    }

    const endpoints = Object.keys(api.paths)
      .filter((path) => paths.some((entry) => path.startsWith(entry)))
      .filter((path) => !path.split("/").includes("internal"))
      .map((path) => {
        return {
          path,
          operations: Object.keys(api.paths[path])
            .filter((method) => method !== "parameters")
            .filter((method) => !method?.tags?.some((tag) => ["private", "system"].includes(tag)))
            .map((method) => {
              const apiMethod = api.paths[path][method];
              const parameters = apiMethod?.parameters;
              const responses = apiMethod?.responses;
              const bodyParameter = parameters?.find((parameter) => parameter.name === "body");
              let body;

              if (bodyParameter) {
                body = bodyParameter.schema?.$ref
                  ? extractDefinition(bodyParameter.schema?.$ref)
                  : renderProperties(bodyParameter.schema);
              }

              return {
                method,
                ...apiMethod,
                body: JSON.stringify(body, null, 2),
                parameters: parameters?.filter((parameter) => parameter.name !== "body") || [],
                pathParameters: api.paths[path]?.parameters || [],
                responseMessages: Object.keys(responses || {}).map((response) => {
                  return {
                    code: response,
                    ...responses[response],
                    schema: JSON.stringify(
                      extractDefinition(responses[response]?.schema?.$ref),
                      null,
                      2
                    ),
                  };
                }),
              };
            }),
        };
      });

    return <Swagger documentation={{ apis: endpoints }} prefix="https://api.spectrocloud.com" />;
  }

  return (
    <Layout
      menu={menu}
      fullWidth={mdx.frontmatter?.fullWidth}
      logoLocation="/api"
      subLogo={
        <path
          d="M276.865 37.1465H270.836L269.869 40H265.75L271.595 23.8453H276.152L281.997 40H277.832L276.865 37.1465ZM275.852 34.1088L273.85 28.1947L271.871 34.1088H275.852ZM298.619 29.0461C298.619 29.9819 298.404 30.8411 297.974 31.6235C297.545 32.3906 296.885 33.0119 295.995 33.4875C295.105 33.9631 294.001 34.2009 292.682 34.2009H290.242V40H286.307V23.8453H292.682C293.97 23.8453 295.059 24.0678 295.949 24.5127C296.839 24.9576 297.506 25.5712 297.951 26.3537C298.396 27.1361 298.619 28.0336 298.619 29.0461ZM292.382 31.0712C293.134 31.0712 293.694 30.8948 294.062 30.5419C294.43 30.1891 294.615 29.6905 294.615 29.0461C294.615 28.4018 294.43 27.9032 294.062 27.5503C293.694 27.1975 293.134 27.021 292.382 27.021H290.242V31.0712H292.382ZM307.134 23.8453V40H303.199V23.8453H307.134Z"
          fill="#3575CF"
        />
      }
      extraMenu={<ApiSidebar allMdx={allMdx} />}
    >
      <DocsLayout
        menu={menu}
        mdx={mdx}
        fullWidth={mdx.frontmatter?.fullWidth || mdx.frontmatter?.api}
        docsLocation={apiLocation}
        hideToCSidebar={mdx.frontmatter?.hideToCSidebar}
        edges={allMdx.edges}
        extraContent={renderAPIDoc()}
      />
    </Layout>
  );
}

export const pageQuery = graphql`
  query ($id: String!) {
    site {
      siteMetadata {
        title
        apiLocation
      }
    }
    mdx(fields: { id: { eq: $id } }) {
      fields {
        id
        title
        slug
        version
      }
      body
      tableOfContents
      parent {
        ... on File {
          relativePath
        }
      }
      frontmatter {
        metaTitle
        metaDescription
        fullWidth
        hideToC
        paths
        hideToCSidebar
        hideMenuSidebar
        api
      }
    }
    allMdx(filter: { fields: { isApiPage: { eq: true } } }) {
      edges {
        node {
          tableOfContents
          fields {
            slug
            title
            icon
            index
            hiddenFromNav
            api
            version
          }
        }
      }
    }
  }
`;
