import React from "react";
import Link from "@librarium/shared/src/components/Link";
import { graphql, useStaticQuery } from "gatsby";
import styled from "styled-components";
import icons from "assets/icons/integrations";

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
            icon
          }
        }
      }
    }
  }
`

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 32px;
`;

const ImageWrapper = styled.div`
  height: 52px;
  margin: 10px 0 15px;

  > img {
    height: 100%;
  }
`;

const Card = styled.div`
  width: 120px;
  height: 120px;
  margin-right: 32px;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.2), 0px 2px 0px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
`;

const Title = styled.div`
  font-size: 13px;
  line-height: 14px;
  letter-spacing: 0.02em;
  color: #555555;
`;


export default function Integrations() {
  const data = useStaticQuery(query);
  const packs = [...data.allMdx.edges];

  function getOrderedCategoryPacks(category) {
    return packs
      .filter(({ node }) => node.fields.category.includes(category))
      .sort((pack1, pack2) => {
        const title1 = pack1.node.fields.title;
        const title2 = pack2.node.fields.title;

        if (title1 < title2) {
          return -1;
        }

        if (title1 > title2) {
          return 1;
        };

        return 0;
      });
  }

  const categoryPacks = {
    cloud: getOrderedCategoryPacks("cloud"),
    os: getOrderedCategoryPacks("os"),
    kubernetes: getOrderedCategoryPacks("kubernetes"),
    network: getOrderedCategoryPacks("network"),
    monitoring: getOrderedCategoryPacks("monitoring"),
    storage: getOrderedCategoryPacks("storage"),
    authentication: getOrderedCategoryPacks("authentication"),
    ingress: getOrderedCategoryPacks("ingress"),
    load_balancer: getOrderedCategoryPacks("load_balancer"),
    logging: getOrderedCategoryPacks("logging"),
    security: getOrderedCategoryPacks("security"),
  }

  const orderedPacks = Object.keys(categoryPacks).map(category => categoryPacks[category]).flat();

  return (
    <Wrapper>
      {orderedPacks.map(({ node }) => {
        const { icon, title, slug } = node.fields;
        return (
          <Link to={slug}>
            <Card>
              <ImageWrapper>
                <img src={icons[icon]} alt={`${title} logo`} />
              </ImageWrapper>
              <Title>{title}</Title>
            </Card>
          </Link>
        );
      })}
    </Wrapper>
  );
}
