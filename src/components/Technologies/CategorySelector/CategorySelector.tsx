import React from "react";
import styles from "./CategorySelector.module.scss";

interface CategorySelectorProps {
  categories: string[];
  selected: string;
  selectCategory: (category: string) => void;
}

export default function CategorySelector({
  categories,
  selected = "all",
  selectCategory,
}: CategorySelectorProps) {
  return (
    <div className={styles.wrapper}>
      {categories.map((category, index) => (
        <div
          className={`${styles.selectorCard} ${selected === category ? styles.isSelected : ""}`}
          key={index}
          onClick={() => {
            selectCategory(category);
          }}
        >
          {category.split("_").join(" ")}
        </div>
      ))}
    </div>
  );
}
