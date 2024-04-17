import React, { useState, useMemo } from "react";
import Fuse from "fuse.js";
import styles from "./Technologies.module.scss";
import Search from "./Search";
import { PacksData, IntegrationsData, FrontMatterData } from "../Integrations/IntegrationTypes";
import TechnologyCard from "./TechnologyCard";
import PacksFilters from "./PacksFilters";
import { packTypeNames } from "./PackConstants";
import { Collapse, ConfigProvider, ThemeConfig, theme } from "antd";
import "./technologies.antd.css";
import IconMapper from "../IconMapper/IconMapper";
import { useColorMode } from "@docusaurus/theme-common";

const searchOptions = {
  threshold: 0.5,
  keys: ["title"],
};

interface TechnologiesProps {
  data: PacksData[] | IntegrationsData[];
}

export default function Technologies({ data }: TechnologiesProps) {
  const { isDarkTheme } = useColorMode();
  const { defaultAlgorithm, darkAlgorithm } = theme;
  const [selectedFilters, setSelectedFilters] = useState<{ category: string[], provider: string, additionalFilters: string[] }>({ category: [], provider: "", additionalFilters: [] })
  const [searchValue, setSearchValue] = useState("");

  const categories = useMemo(() => {
    const categoriesMap = data.reduce((acc: Map<string, any>, technology: PacksData | IntegrationsData) => {
      let packType = technology.fields.packType;
      if (acc.has(packType)) {
        acc.get(packType).push(technology.fields);
      } else {
        acc.set(packType, [technology.fields]);
      }
      return acc;
    }, new Map<string, any>());
    const sortedCategoriesMap = new Map([...categoriesMap.entries()].sort());
    const categoryKeys = Array.from(sortedCategoriesMap.keys());
    categoryKeys.forEach((category) => {
      const fields = sortedCategoriesMap.get(category);
      fields.sort((field1: any, field2: any) => {
        if (field1.name > field2.name) {
          return 1;
        } else if (field1.name < field2.name) {
          return -1;
        } else {
          return 0;
        }
      });
    })
    return sortedCategoriesMap;
  }, [data]);

  const filteredTechCards = useMemo(() => {
    let categoryKeys: string[] = Array.from(categories.keys());
    if (selectedFilters.category.length > 0) {
      categoryKeys = categoryKeys.filter((category: string) => {
        return selectedFilters.category.includes(category);
      });
    }
    const selectedCategoryItems = new Map<string, any>();
    categoryKeys.forEach((category) => {
      let filteredCards = categories.get(category);
      if (searchValue) {
        const fuse = new Fuse(filteredCards, searchOptions);
        filteredCards = fuse.search(searchValue).map(({ item }) => item);
      }
      if (selectedFilters.provider) {
        filteredCards = filteredCards.filter((techCard: FrontMatterData) => {
          return techCard.cloudTypes.includes("all") || techCard.cloudTypes.includes(selectedFilters.provider);
        });
      }

      if (selectedFilters.additionalFilters?.length && selectedFilters.additionalFilters.includes("Verified")) {
        filteredCards = filteredCards.filter((techCard: FrontMatterData) => {
          return techCard.verified;
        }) as FrontMatterData[];
      }
      if (selectedFilters.additionalFilters?.length && selectedFilters.additionalFilters.includes("Community")) {
        filteredCards = filteredCards.filter((techCard: FrontMatterData) => {
          return techCard.community;
        });
      }
      selectedCategoryItems.set(category, filteredCards);
    });
    if (!selectedFilters.category.length && !selectedFilters.provider && !selectedFilters.additionalFilters.length && !searchValue) {
      return categories;
    } else {
      return selectedCategoryItems;
    }
  }, [data, selectedFilters, searchValue]);

  const onSearch = (value: string) => {
    setSearchValue(value);
  };
  const renderPacks = (fields: FrontMatterData[]) => {
    return fields.map((field) => {
      const { title, logoUrl, packType, name } = field;
      return <TechnologyCard name={name} title={title} logoUrl={logoUrl} type={packType}></TechnologyCard>;
    });
  };
  const renderPacksCategories = () => {
    const renderedCategoryItems: React.ReactNode[] = [];
    let categoryKeys: string[] = Array.from(filteredTechCards.keys());
    categoryKeys.forEach((category) => {
      const categoryItems = filteredTechCards.get(category);
      if (categoryItems.length) {
        const obj = (<Collapse.Panel header={addPanelHeader(category)} key={category}>{renderPacks(categoryItems)}</Collapse.Panel>)
        renderedCategoryItems.push(obj);
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
  };


  return (
    <div className={styles.wrapper}>
      <ConfigProvider theme={{
        algorithm: isDarkTheme ? darkAlgorithm : defaultAlgorithm,
      }}>
        <PacksFilters categories={Array.from(categories.keys())} setSelectedSearchFilters={setSelectedSearchFilters} selectedFilters={selectedFilters} />
        <Search onSearch={onSearch} placeholder={"Search for integration..."} />
        <div className={styles.technologyWrapper}>
          <Collapse expandIconPosition="end" >
            {renderPacksCategories()}
          </Collapse>
        </div>
      </ConfigProvider>
    </div>
  );
}
