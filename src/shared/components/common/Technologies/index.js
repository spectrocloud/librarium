import React, { useState, useMemo } from "react";
import styled from "styled-components";
import Fuse from "fuse.js";
import Link from "shared/components/Link";

import Search from "./Search";
import CategorySelector from "./CategorySelector";

const Wrapper = styled.div`
  padding: 15px 0;
`;

const TechnologiesWrapper = styled.div`
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
  margin: 5px 0 5px;

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
  background: #fff;
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
  keys: ["fields.title"],
};

export default function Technologies({ data }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchValue, setSearchValue] = useState("");

  let categories = useMemo(() => {
    const categoriesSet = data.reduce((accumulator, technology) => {
      const categories = technology.fields.category || [];
      categories.forEach((category) => {
        accumulator.add(category);
      });
      return accumulator;
    }, new Set(["all"]));
    return new Set([...categoriesSet].sort());
  }, [data]);

  let technologies = useMemo(() => {
    let technologies = [...data].sort((pack1, pack2) => {
      const category1 = pack1.fields.category[0];
      const category2 = pack2.fields.category[0];

      if (category1 < category2) {
        return -1;
      }

      if (category1 > category2) {
        return 1;
      }

      return 0;
    });

    if (searchValue) {
      const fuse = new Fuse(technologies, searchOptions);
      technologies = fuse.search(searchValue).map(({ item }) => item);
    }

    if (selectedCategory !== "all") {
      technologies =
        technologies.filter(({ fields }) => fields.category.includes(selectedCategory)) || [];
    }

    return technologies;
  }, [data, searchValue, selectedCategory]);

  return (
    <Wrapper>
      <CategorySelector
        categories={[...categories]}
        selectCategory={setSelectedCategory}
        selected={selectedCategory}
      />
      <Search onSearch={setSearchValue} />
      <TechnologiesWrapper>
        {technologies.map(({ fields }) => {
          const { title, slug, logoUrl } = fields;
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
      </TechnologiesWrapper>
    </Wrapper>
  );
}
