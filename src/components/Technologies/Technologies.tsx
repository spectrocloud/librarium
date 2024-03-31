import React, { useState, useMemo } from "react";
import Fuse from "fuse.js";
import styles from "./Technologies.module.scss";
import Search from "./Search";
import { PacksData, IntegrationsData } from "../Integrations/IntegrationTypes";
import TechnologyCard from "./TechnologyCard";
import PacksFilters from "./PacksFilters";
import { packTypeNames } from "./PackConstants";
import { Collapse } from "antd";
import "./technologies.antd.css";

const searchOptions = {
  threshold: 0.5,
  keys: ["fields.title"],
};

interface TechnologiesProps {
  data: PacksData[] | IntegrationsData[];
}

export default function Technologies({ data }: TechnologiesProps) {
  const [selectedFilters, setSelectedFilters] = useState({ category: [""]});
  const [searchValue, setSearchValue] = useState("");

  const categories = useMemo(() => {
    const categoriesMap = new Map();
    data.forEach((technology) => {
      const key = technology.fields.packType;
      if(categoriesMap.has(key)){
        categoriesMap.get(key).push(technology.fields);
      } else {
        categoriesMap.set(key, new Array(technology.fields));
      }
    });
    const sortedCategoriesMap = new Map([...categoriesMap.entries()].sort());
    const categoryKeys = Array.from(sortedCategoriesMap.keys());
    categoryKeys.forEach((category) => {
      const fields = sortedCategoriesMap.get(category);
      fields.sort((field1, field2) => {
        if(field1.name > field2.name){
          return 1;
        } else if(field1.name < field2.name){
          return -1;
        } else {
          return 0;
        }
      });
    })
    return sortedCategoriesMap;
  }, [data]);

  const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };
  const renderPacks = (fields) => {
    return fields.map((field) => {
      const { title, slug, logoUrl, packType } = field;
      return <TechnologyCard title={title} slug={slug} logoUrl={logoUrl} key={slug} type={packType}></TechnologyCard>;
    });
  };
  const renderPacksCategories = () => {
    const categoryKeys = Array.from(categories.keys());
    const categoryItems = [];
    categoryKeys.forEach((category) => {
      const obj = (<Collapse.Panel header={packTypeNames[category]} key={category}>{renderPacks(categories.get(category))}</Collapse.Panel>)
      categoryItems.push(obj)
    });
    return categoryItems;
  };
  const setSelectedSearchFilters = (selectedSearchFilters) => {
    setSelectedFilters(selectedSearchFilters)
  }
  return (
    <div className={styles.wrapper}>
      <PacksFilters categories={Array.from(categories.keys())} setSelectedSearchFilters={setSelectedSearchFilters} selectedFilters={selectedFilters} />
      <Search onSearch={onSearch} placeholder={"Search for integration..."} />
      <div className={styles.technologyWrapper}>
        <Collapse expandIconPosition="end" >
          {renderPacksCategories()}
        </Collapse>
      </div>
    </div>
  );
}
