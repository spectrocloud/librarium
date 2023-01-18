import React from "react";
import { graphql, useStaticQuery } from "gatsby";
import Technologies from "../Technologies";

export default function AppTiers() {
  const query = useStaticQuery(graphql`
    query {
      allMdx(filter: { frontmatter: { type: { eq: "appTier" } } }) {
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

  return <Technologies data={query.allMdx.nodes} />;
}
