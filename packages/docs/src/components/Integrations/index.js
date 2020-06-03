import React from "react";
import {graphql, useStaticQuery} from "gatsby";

const query = graphql`
  query GetIntegrations {
    allMdx(filter: {fields: {isIntegration: {eq: true}}}) {
      edges {
        node {
          fields {
            id
            title
            slug
            category
          }
        }
      }
    }
  }
`


export default function Integrations() {
  const data = useStaticQuery(query);

  console.log(data);
  return <div>I't not that hard</div>
}
