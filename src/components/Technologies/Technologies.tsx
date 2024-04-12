import React, { useState, useMemo } from "react";
import Fuse from "fuse.js";
import styles from "./Technologies.module.scss";
import Search from "./Search";
import { PacksData, IntegrationsData, FrontMatterData } from "../Integrations/IntegrationTypes";
import TechnologyCard from "./TechnologyCard";
import PacksFilters from "./PacksFilters";
import { packTypeNames } from "./PackConstants";
import { Collapse } from "antd";
import "./technologies.antd.css";
import IconMapper from "../IconMapper/IconMapper";

const searchOptions = {
  threshold: 0.5,
  keys: ["fields.title"],
};

interface TechnologiesProps {
  data: PacksData[] | IntegrationsData[];
}

export default function Technologies({ data }: TechnologiesProps) {
  const [selectedFilters, setSelectedFilters] = useState<{category: string[], provider: string, additionalFilters: string[]}>({category: [], provider: "", additionalFilters: []})
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
      fields.sort((field1: any, field2: any) => {
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
  const renderPacks = (fields: FrontMatterData[]) => {
    return fields.map((field) => {
      const { title, logoUrl, packType, name } = field;
      return <TechnologyCard name={name} title={title} logoUrl={logoUrl} type={packType}></TechnologyCard>;
    });
  };
  const renderPacksCategories = () => {
    let categoryKeys: string[] = Array.from(categories.keys());
    const categoryItems: JSX.Element[] = [];
    if(selectedFilters.category.length > 0) {
      categoryKeys = categoryKeys.filter((category: string) => { // Add type annotation for category parameter
        return selectedFilters.category.includes(category as never);
      });
    }
    categoryKeys.forEach((category) => {
      let filteredTechCards = categories.get(category);
      if (selectedFilters.provider) {
        filteredTechCards = filteredTechCards.filter((techCard: FrontMatterData) => {
          return techCard.cloudTypes.includes("all") || techCard.cloudTypes.includes(selectedFilters.provider);
        });
      }
      //TODO: Add additional filter logic based on backend API data like community, FIPs
      if (selectedFilters.additionalFilters?.length && selectedFilters.additionalFilters.includes("Verified")) {
        filteredTechCards = filteredTechCards.filter((techCard: FrontMatterData) => {
          return techCard.verified;
        });
      }
      if (selectedFilters.additionalFilters?.length && selectedFilters.additionalFilters.includes("Community")) {
        filteredTechCards = filteredTechCards.filter((techCard: FrontMatterData) => {
          return techCard.community;
        });
      }
      if (filteredTechCards.length) {
        const obj = (<Collapse.Panel header={addPanelHeader(category)} key={category}>{renderPacks(filteredTechCards)}</Collapse.Panel>)
        categoryItems.push(obj);
      }
    });
    return categoryItems;
  };
  function addPanelHeader(category: string) {
    return (
      <>
        <IconMapper type={category} />
        {packTypeNames[category as keyof typeof packTypeNames]}
      </>
    );
  }
  const setSelectedSearchFilters = (selectedSearchFilters: Record<string, any>) => {
    setSelectedFilters((prevState) => ({
      ...prevState,
      ...selectedSearchFilters
    }));
  };
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
