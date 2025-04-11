import React, { useState, useMemo, useEffect } from "react";
import Fuse from "fuse.js";
import styles from "./Technologies.module.scss";
import Search from "./Search";
import { FrontMatterData } from "../Integrations/IntegrationTypes";
import TechnologyCard from "./TechnologyCard";
import PacksFilters from "./PacksFilters";
import { packTypeNames, packTypes } from "../../constants/packs";
import { Collapse } from "antd";
import "./technologies.antd.css";
import IconMapper from "../IconMapper/IconMapper";

const searchOptions = {
  threshold: 0.5,
  keys: ["title"],
};

interface TechnologiesProps {
  data: FrontMatterData[];
  repositories: any[];
}

interface SelectedFilters {
  category: string[];
  registries: string[];
  cloudTypes: string[];
  source: string[];
}

const PACKLISTFILTERS = "packListFilters";

export default function Technologies({ data, repositories }: TechnologiesProps) {
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    category: [],
    registries: [],
    cloudTypes: [],
    source: ["all"],
  });

  const [searchValue, setSearchValue] = useState<string>("");

  const filteredTechCards = useMemo(() => {
    const selectedFiltersKeys = Object.keys(selectedFilters) as (keyof SelectedFilters)[];
    let filteredCards: FrontMatterData[] = [];
    const conditions = selectedFiltersKeys.reduce(
      (acc: ((techCard: FrontMatterData) => boolean)[], key) => {
        const selectedFiltersValue = selectedFilters[key];
        if (selectedFiltersValue.length) {
          let condition: (techCard: FrontMatterData) => boolean = () => false;
          if (selectedFiltersValue && selectedFiltersValue.length) {
            switch (key) {
              case "category":
                condition = (techCard: FrontMatterData) => {
                  return selectedFiltersValue.includes(techCard.packType);
                };
                break;
              case "registries":
                condition = (techCard: FrontMatterData) => {
                  return selectedFiltersValue.some((value) => techCard.registries.includes(value));
                };
                break;
              case "cloudTypes":
                condition = (techCard: FrontMatterData) => {
                  return selectedFiltersValue.some(
                    (value) => techCard.cloudTypes.includes("all") || techCard.cloudTypes.includes(value)
                  );
                };
                break;
              case "source":
                if (!selectedFiltersValue.includes("all")) {
                  condition = (techCard: FrontMatterData) => {
                    return !!techCard[selectedFiltersValue[0] as keyof FrontMatterData];
                  };
                } else {
                  condition = () => true;
                }
                break;
            }
            if (condition) {
              acc.push(condition);
            }
          }
        }
        return acc;
      },
      [] as ((techCard: FrontMatterData) => boolean)[]
    );

    filteredCards = data.filter((card) => {
      if (conditions.length) {
        return conditions.every((condition) => condition(card));
      } else {
        return true;
      }
    });

    if (searchValue) {
      const fuse = new Fuse<FrontMatterData>(filteredCards, searchOptions);
      filteredCards = fuse.search(searchValue).map(({ item }) => item);
    }

    const categoriesMap = filteredCards.reduce((acc: Map<string, FrontMatterData[]>, technology: FrontMatterData) => {
      const packType = technology.packType;
      if (acc.has(packType)) {
        acc.get(packType)!.push(technology);
      } else {
        acc.set(packType, [technology]);
      }
      return acc;
    }, new Map<string, FrontMatterData[]>());

    const sortedCategoriesMap = new Map(
      [...categoriesMap.entries()].sort(([key1], [key2]) => {
        const name1 = packTypeNames[key1];
        const name2 = packTypeNames[key2];
        if (!name1) return 1;
        if (!name2) return -1;
        return name1.localeCompare(name2);
      })
    );

    sortedCategoriesMap.forEach((techCards) => {
      techCards.sort((a, b) => a.title.localeCompare(b.title));
    });

    return sortedCategoriesMap;
  }, [data, selectedFilters, searchValue]);

  useEffect(() => {
    const filters = localStorage.getItem(PACKLISTFILTERS);
    if (filters) {
      try {
        const parsedFilters = JSON.parse(filters) as { selectedFilters: SelectedFilters; searchValue: string };
        setSelectedFilters(parsedFilters.selectedFilters);
        setSearchValue(parsedFilters.searchValue || "");
      } catch (e) {
        console.error("Error in parsing filters from local storage", e);
      }
    } else {
      setFiltersInLocalStorage({
        selectedFilters: selectedFilters,
        searchValue: "",
      });
    }
  }, []);

  const renderPacksCategories = () => {
    const categoryKeys = Array.from(filteredTechCards.keys());
    return categoryKeys.map((category) => {
      const categoryItems = filteredTechCards.get(category)!;
      if (categoryItems.length) {
        return (
          <Collapse.Panel header={addPanelHeader(category)} key={category}>
            {categoryItems.map((field) => {
              const { title, logoUrl, packType, name, latestVersion, versions } = field;
              return (
                <TechnologyCard
                  key={name}
                  name={name}
                  title={title}
                  logoUrl={logoUrl}
                  type={packType}
                  version={latestVersion}
                  versions={versions}
                />
              );
            })}
          </Collapse.Panel>
        );
      }
      return null;
    });
  };

  function addPanelHeader(category: string) {
    return (
      <>
        <IconMapper type={category} />
        {packTypeNames[category]}
      </>
    );
  }

  const setSelectedSearchFilters = (selectedSearchFilters: Partial<SelectedFilters>) => {
    const updatedFilters = {
      ...selectedFilters,
      ...selectedSearchFilters,
    };
    setFiltersInLocalStorage({
      selectedFilters: updatedFilters,
      searchValue: searchValue,
    });
    setSelectedFilters(updatedFilters);
  };

  const onSearch = (value: string) => {
    setFiltersInLocalStorage({
      selectedFilters: selectedFilters,
      searchValue: value,
    });
    setSearchValue(value);
  };

  const setFiltersInLocalStorage = (filters: { selectedFilters: SelectedFilters; searchValue: string }) => {
    localStorage.setItem(PACKLISTFILTERS, JSON.stringify(filters));
  };

  return (
    <div className={styles.wrapper}>
      <PacksFilters
        categories={[...packTypes]}
        registries={repositories}
        setSelectedSearchFilters={setSelectedSearchFilters}
        selectedFilters={selectedFilters}
      />
      <Search onSearch={onSearch} placeholder={"Search for integration..."} value={searchValue} />
      <div className={styles.technologyWrapper}>
        <Collapse defaultActiveKey={Array.from(filteredTechCards.keys())} expandIconPosition="end">
          {renderPacksCategories()}
        </Collapse>
      </div>
    </div>
  );
}
