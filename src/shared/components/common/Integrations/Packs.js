import React from "react";
import { graphql, useStaticQuery } from "gatsby";
import Integrations from "../Technologies";

export default function Packs() {
  const query = useStaticQuery(graphql`
    query {
      allMdx(filter: { frontmatter: { type: { eq: "integration" } } }) {
        nodes {
          fields {
            id
            slug
            title
            icon
            index
            hiddenFromNav
            category
            isIntegration
            isDocsPage
            logoUrl
          }
        }
      }
    }
  `);

  return <Integrations data={query.allMdx.nodes} />;
}
