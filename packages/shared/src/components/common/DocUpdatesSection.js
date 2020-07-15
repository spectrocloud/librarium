import React from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';
import moment from 'moment';

import { useGraphQL } from '../../graphql';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
  max-width: 1024px;
  margin: 30px auto 0;
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
  border-bottom: 1px solid #f2f2f2;
`;

const Description = styled.div`
  font-size: 12px;
  color #555;
`;

const Timestamp = styled.div`
  font-size: 12px;
  color: #bbb;
  margin-top: 5px;
`;

export default function DocUpdatesSection({ title }) {
  const pageContext = useGraphQL();
  console.log(pageContext)
  const lastChanges = [...(pageContext?.latestUpdates?.edges || [])]
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
        {lastChanges.map((doc) => (
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
