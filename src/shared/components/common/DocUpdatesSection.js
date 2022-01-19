import React from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';
import moment from 'moment';
import { graphql, useStaticQuery } from "gatsby"

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 780px;
  margin: 0px auto;
  h3 {
    margin-bottom: 50px !important;
    margin-top: 102px !important;
  }
`;

const CardsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 680px;
`;

const Card = styled(Link)`
  width: 100%;
  padding: 20px 0;
  margin-bottom: 50px;
  h3 {
    font-weight: 500;
    font-size: 16px;
    line-height: 28px;
    color: #2d2e55;
  }
`;

const Description = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 28px;
  color: #666a80;
  margin-top: 16px;
`;

const Timestamp = styled.div`
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 28px;
  color: #9698a9;
  margin-top: 16px;
`;

export default function DocUpdatesSection({ title }) {
    const data = useStaticQuery(graphql`
    query {
      latestUpdates: allMdx(filter: {fields: {isDocsPage: {eq: true}}}) {
          edges {
            node {
              fields {
                title
                slug
              }
              excerpt
              parent {
                ... on File {
                  id
                  name
                  modifiedTime
                }
              }
            }
          }
        }
      }
  `)

  const lastChanges = [...(data?.latestUpdates?.edges || [])]
    .map(({ node }) => ({ ...node }))
    .sort((node1, node2) => {
      const modifiedTime1 = moment(node1.parent.modifiedTime);
      const modifiedTime2 = moment(node2.parent.modifiedTime);
      return moment(modifiedTime2).diff(modifiedTime1);
    });

  lastChanges.splice(4, lastChanges.length - 4);

  return (
    <Wrapper>
      <h3>{title}</h3>
      <CardsWrapper>
        {lastChanges.map(doc => (
          <Card to={doc.fields.slug}>
            <h4>{doc.fields.title}</h4>
            <Description>{doc.excerpt}</Description>
            <Timestamp>{moment(doc.parent.modifiedTime).format('MMM DD YYYY')}</Timestamp>
          </Card>
        ))}
      </CardsWrapper>
    </Wrapper>
  );
}

