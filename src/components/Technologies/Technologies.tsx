import React, { useState, useMemo } from "react";
import Fuse from "fuse.js";
import styles from "./Technologies.module.scss";
import Search from "./Search";
import CategorySelector from "./CategorySelector";
import { PacksData, IntegrationsData } from "../Integrations/IntegrationTypes";
import TechnologyCard from "./TechnologyCard";

const searchOptions = {
  threshold: 0.5,
  keys: ["fields.title"],
};

interface TechnologiesProps {
  data: PacksData[] | IntegrationsData[];
}

export default function Technologies({ data }: TechnologiesProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchValue, setSearchValue] = useState("");

  const categories = useMemo(() => {
    const categoriesSet = data.reduce(
      (accumulator, technology) => {
        const categories = technology.fields.category || [];
        categories.forEach((category) => {
          accumulator.add(category);
        });
        return accumulator;
      },
      new Set(["all"]),
    );
    return new Set([...categoriesSet].sort());
  }, [data]);

  const technologies = useMemo(() => {
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
        technologies.filter(({ fields }) =>
          fields.category.includes(selectedCategory),
        ) || [];
    }

    return technologies;
  }, [data, searchValue, selectedCategory]);

  const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  return (
    <div className={styles.wrapper}>
      <CategorySelector
        categories={[...categories]}
        selectCategory={setSelectedCategory}
        selected={selectedCategory}
      />
      <Search onSearch={onSearch} placeholder={"Search for integration..."} />
      <div className={styles.technologyWrapper}>
        {technologies.map(({ fields }) => {
          const { title, slug, logoUrl } = fields;
          return (
            <TechnologyCard
              title={title}
              slug={slug}
              logoUrl={logoUrl}
              key={slug}
            ></TechnologyCard>
          );
        })}
      </div>
    </div>
  );
}
