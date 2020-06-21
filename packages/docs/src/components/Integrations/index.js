import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import Fuse from 'fuse.js';
import Link from '@librarium/shared/src/components/Link';

import Search from './Search';
import CategorySelector from './CategorySelector';

const Wrapper = styled.div`
  padding: 15px 0;
`;

const IntegrationsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 32px;
`;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 52px;
  width: 100%;
  margin: 10px 0 15px;

  > img {
    max-height: 100%;
    max-width: 100%;
  }
`;

const Card = styled.div`
  width: 120px;
  height: 120px;
  margin-right: 32px;
  margin-bottom: 32px;
  padding: 10px;
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
  text-align: center;
`;

const searchOptions = {
  threshold: 0.5,
  keys: ['node.fields.title'],
};

export default function Integrations({edges = []}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchValue, setSearchValue] = useState('');

  let categories = useMemo(() => {
    return edges.reduce((accumulator, integration) => {
      accumulator.add(...(integration.node.fields.category || []));
      return accumulator;
    }, new Set(['all']));
  }, [edges]);

  let integrations = useMemo(() => {
    let integrations = [...edges].sort((pack1, pack2) => {
      const category1 = pack1.node.fields.category[0];
      const category2 = pack2.node.fields.category[0];

      if (category1 < category2) {
        return -1;
      }

      if (category1 > category2) {
        return 1;
      }

      return 0;
    });

    if (searchValue) {
      const fuse = new Fuse(integrations, searchOptions);
      integrations = fuse.search(searchValue).map(({ item }) => item);
    }

    if (selectedCategory !== 'all') {
      integrations =
        integrations.filter(({ node }) => node.fields.category.includes(selectedCategory)) || [];
    }

    return integrations;
  }, [edges, searchValue, selectedCategory]);

  return (
    <Wrapper>
      <CategorySelector
        categories={[...categories]}
        selectCategory={setSelectedCategory}
        selected={selectedCategory}
      />
      <Search onSearch={setSearchValue} />
      <IntegrationsWrapper>
        {integrations.map(({ node }) => {
          const { title, slug, logoUrl } = node.fields;
          return (
            <Link key={title} to={slug}>
              <Card>
                <ImageWrapper>
                  <img src={logoUrl} alt={`${title} logo`} />
                </ImageWrapper>
                <Title>{title}</Title>
              </Card>
            </Link>
          );
        })}
      </IntegrationsWrapper>
    </Wrapper>
  );
}
