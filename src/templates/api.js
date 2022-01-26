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
      siteMetadata: { docsLocation },
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
          d="M141.917 41.005H137.747L137.057 43H134.852L138.617 32.515H141.062L144.827 43H142.607L141.917 41.005ZM141.347 39.325L139.832 34.945L138.317 39.325H141.347ZM154.619 35.77C154.619 36.33 154.484 36.855 154.214 37.345C153.954 37.835 153.539 38.23 152.969 38.53C152.409 38.83 151.699 38.98 150.839 38.98H149.084V43H146.984V32.53H150.839C151.649 32.53 152.339 32.67 152.909 32.95C153.479 33.23 153.904 33.615 154.184 34.105C154.474 34.595 154.619 35.15 154.619 35.77ZM150.749 37.285C151.329 37.285 151.759 37.155 152.039 36.895C152.319 36.625 152.459 36.25 152.459 35.77C152.459 34.75 151.889 34.24 150.749 34.24H149.084V37.285H150.749ZM158.96 32.53V43H156.86V32.53H158.96Z"
          fill="url(#paint1_linear)"
        />
      }
      extraMenu={<ApiSidebar allMdx={allMdx} />}
    >
      <DocsLayout
        menu={menu}
        mdx={mdx}
        fullWidth={mdx.frontmatter?.fullWidth || mdx.frontmatter?.api}
        docsLocation={docsLocation}
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
        docsLocation
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
