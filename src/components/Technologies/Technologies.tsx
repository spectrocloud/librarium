import React, { useState, useMemo } from "react";
import Fuse from "fuse.js";
import styles from "./Technologies.module.scss";
import Search from "./Search";
import { FrontMatterData } from "../Integrations/IntegrationTypes";
import TechnologyCard from "./TechnologyCard";
import PacksFilters from "./PacksFilters";
import { packTypeNames, packTypes } from "../../constants/packs";
import { Collapse, ConfigProvider, theme } from "antd";
import "./technologies.antd.css";
import IconMapper from "../IconMapper/IconMapper";
import { useColorMode } from "@docusaurus/theme-common";

const searchOptions = {
  threshold: 0.5,
  keys: ["title"],
};

interface TechnologiesProps {
  data: FrontMatterData[];
  repositories: any[];
}

export default function Technologies({ data, repositories }: TechnologiesProps) {
  const { isDarkTheme } = useColorMode();
  const { defaultAlgorithm, darkAlgorithm } = theme;
  const [selectedFilters, setSelectedFilters] = useState<{ category: any[], registries: any[], cloudTypes: any[], verified: any[], community: any[] }>({ category: [], registries: [], cloudTypes: [], verified: [], community: [] })
  const [searchValue, setSearchValue] = useState<string>("");

  const filteredTechCards = useMemo(() => {
    const selectedFiltersKeys = Object.keys(selectedFilters)
    let filteredCards: any[] = [];

    const conditions = selectedFiltersKeys.reduce((acc, key) => {
      const selectedFiltersValue = selectedFilters[key as keyof typeof selectedFilters];
      if (selectedFiltersValue.length) {
        let condition;
        if (selectedFiltersValue && selectedFiltersValue.length) {
          switch (key) {
            case "category":
              condition = (techCard: FrontMatterData) => {
                return selectedFiltersValue.includes(techCard.packType);
              }
              break;
            case "registries":
              condition = (techCard: FrontMatterData) => {
                return selectedFiltersValue.some((value) => techCard.registries.includes(value));
              }
              break;
            case "cloudTypes":
              condition = (techCard: FrontMatterData) => {
                return selectedFiltersValue.some((value) => techCard.cloudTypes.includes("all") || techCard.cloudTypes.includes(value));
              }
              break;
            case "verified":
              condition = (techCard: FrontMatterData) => {
                return techCard["verified"]
              }
              break;
            case "community":
              condition = (techCard: FrontMatterData) => {
                return techCard["community"]
              }
              break;
          }
          if (condition) {
            acc.push(condition)
          }
        }
      }
      return acc;
    }, new Array<any>());
    filteredCards = data.filter((card) => {
      if (conditions.length) {
        return conditions.every((condition) => {
          return condition(card);
        })
      } else {
        return true;
      }
    })
    if (searchValue) {
      const fuse = new Fuse(filteredCards, searchOptions);
      filteredCards = fuse.search(searchValue).map(({ item }) => item);
    }
    const categoriesMap = filteredCards.reduce((acc: Map<string, any>, technology: FrontMatterData) => {
      let packType = technology.packType;
      if (acc.has(packType)) {
        acc.get(packType).push(technology);
      } else {
        acc.set(packType, [technology]);
      }
      return acc;
    }, new Map<string, any>());

    const sortedCategoriesMap = new Map([...categoriesMap.entries()].sort((field1: string, field2: string) => {
      const packType1: keyof typeof packTypeNames = field1;
      const packType2: keyof typeof packTypeNames = field2;
      return packTypeNames[field1[0]].localeCompare(packTypeNames[field2[0]]);
    }));
    const categoryKeys = Array.from(sortedCategoriesMap.keys()) as string[];
    categoryKeys.forEach((category) => {
      let techCards: any = sortedCategoriesMap.get(category);
      techCards.sort((a: FrontMatterData, b: FrontMatterData) => {
        return (a.title.localeCompare(b.title))
      });
    });
    return sortedCategoriesMap;
  }, [data, selectedFilters, searchValue]);

  const renderPacksCategories = () => {
    let categoryKeys: string[] = Array.from(filteredTechCards.keys()) as string[];
    const renderedCategoryItems = categoryKeys.map((category) => {
      const categoryItems = filteredTechCards.get(category) as FrontMatterData[];
      if (categoryItems.length) {
        const obj = (<Collapse.Panel header={addPanelHeader(category)} key={category}>{
          categoryItems.map((field) => {
            const { title, logoUrl, packType, name } = field;
            return <TechnologyCard name={name} title={title} logoUrl={logoUrl} type={packType}></TechnologyCard>;
          })
        }</Collapse.Panel>)
        return obj;
      }
    });
    return renderedCategoryItems;
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
  }

  return (
    <div className={styles.wrapper}>
      <ConfigProvider theme={{
        algorithm: isDarkTheme ? darkAlgorithm : defaultAlgorithm,
      }}>
        <PacksFilters categories={[...packTypes]} registries={repositories} setSelectedSearchFilters={setSelectedSearchFilters} selectedFilters={selectedFilters} />
        <Search onSearch={setSearchValue} placeholder={"Search for integration..."} />
        <div className={styles.technologyWrapper}>
          <Collapse defaultActiveKey={Array.from(filteredTechCards.keys()) as string[]} expandIconPosition="end" >
            {renderPacksCategories()}
          </Collapse>
        </div>
      </ConfigProvider>
    </div>
  );
}
