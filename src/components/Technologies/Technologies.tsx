import React, { useState, useMemo } from "react";
import Fuse from "fuse.js";
import styles from "./Technologies.module.scss";
import Search from "./Search";
import { PacksData, IntegrationsData, FrontMatterData } from "../Integrations/IntegrationTypes";
import TechnologyCard from "./TechnologyCard";
import PacksFilters from "./PacksFilters";
import { packTypeNames, packTypes } from "./PackConstants";
import { Collapse, ConfigProvider, ThemeConfig, theme } from "antd";
import "./technologies.antd.css";
import IconMapper from "../IconMapper/IconMapper";
import { useColorMode } from "@docusaurus/theme-common";

const searchOptions = {
  threshold: 0.5,
  keys: ["title",],
};

interface TechnologiesProps {
  data: PacksData[] | IntegrationsData[];
  repositories: any[];
}

interface SearchFilter {
  name: string;
  values: any;
}

export default function Technologies({ data, repositories }: TechnologiesProps) {
  const { isDarkTheme } = useColorMode();
  const { defaultAlgorithm, darkAlgorithm } = theme;
  const [selectedFilters, setSelectedFilters] = useState<{ category: string[], registries: string[], cloudTypes: string, additionalFilters: string[] }>({ category: [], registries: [], cloudTypes: "", additionalFilters: [] })
  const [searchValue, setSearchValue] = useState<string>("");

  const filteredTechCards = useMemo(() => {
    let _selectedFilters = [] as SearchFilter[];
    Object.keys(selectedFilters).forEach((key) => {
      const _values = selectedFilters[key as keyof typeof selectedFilters];
      if (!_values || _values.length === 0) {
        return;
      }
      if (key === "additionalFilters") {
        const additionalFilters = Array.isArray(_values) ? _values.reduce((acc, _value) => {
          acc.push({
            name: _value,
            values: true
          });
          return acc;
        }, [] as SearchFilter[]) : [];
        _selectedFilters = _selectedFilters.concat(additionalFilters);
      } else {
        _selectedFilters.push({
          name: key,
          values: _values
        });
      }
    });
    let filteredCards: any[] = [];
    filteredCards = data.filter((techCard) => {
      const card = techCard.fields;
      return _selectedFilters.every((condition) => {
        if (condition.name === "category") {
          return condition.values.includes(card.packType);
        } else if (condition.name === "registries") {
          return condition.values.some((registry: string) => card.registries.includes(registry));
        } else if (condition.name === "cloudTypes") {
          return card.cloudTypes.includes("all") || card.cloudTypes.includes(condition.values);
        } else if (["verified", "community"].includes(condition.name)) {
          return card[condition.name as keyof FrontMatterData];
        } else {
          return true;
        }
      })
    })
    if (searchValue) {
      const fuse = new Fuse(filteredCards, searchOptions);
      filteredCards = fuse.search(searchValue).map(({ item }) => item);
    }
    const categoriesMap = filteredCards.reduce((acc: Map<string, any>, technology: PacksData | IntegrationsData) => {
      let packType = technology.fields.packType;
      if (acc.has(packType)) {
        acc.get(packType).push(technology.fields);
      } else {
        acc.set(packType, [technology.fields]);
      }
      return acc;
    }, new Map<string, any>());

    const sortedCategoriesMap = new Map([...categoriesMap.entries()].sort((field1: string, field2: string) => {
      const packType1: keyof typeof packTypeNames = field1;
      const packType2: keyof typeof packTypeNames = field2;
      if (packTypeNames[field1[0]] > packTypeNames[field2[0]]) {
        return 1;
      } else if (packTypeNames[field1[0]] < packTypeNames[field2[0]]) {
        return -1;
      } else {
        return 0;
      }
    }));
    const categoryKeys = Array.from(sortedCategoriesMap.keys()) as string[];
    categoryKeys.forEach((category) => {
      let techCards: any = sortedCategoriesMap.get(category);
      techCards.sort((a: FrontMatterData, b: FrontMatterData) => {
        if (a.title > b.title) {
          return 1;
        } else if (a.title < b.title) {
          return -1;
        } else {
          return 0;
        }
      });
    });
    return sortedCategoriesMap;
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
    let categoryKeys: string[] = Array.from(filteredTechCards.keys()) as string[];
    categoryKeys.forEach((category) => {
      const categoryItems = filteredTechCards.get(category) as FrontMatterData[];
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
  }

  return (
    <div className={styles.wrapper}>
      <ConfigProvider theme={{
        algorithm: isDarkTheme ? darkAlgorithm : defaultAlgorithm,
      }}>
        <PacksFilters categories={[...packTypes]} registries={repositories} setSelectedSearchFilters={setSelectedSearchFilters} />
        <Search onSearch={onSearch} placeholder={"Search for integration..."} />
        <div className={styles.technologyWrapper}>
          <Collapse activeKey={Array.from(filteredTechCards.keys()) as string[]} expandIconPosition="end" >
            {renderPacksCategories()}
          </Collapse>
        </div>
      </ConfigProvider>
    </div>
  );
}
