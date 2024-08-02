import React, { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Search.module.scss";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";

interface IntegrationSearchProps {
  onSearch: (searchString: string) => void;
  placeholder: string;
  value?: string;
}

export default function IntegrationSearch({ onSearch, placeholder, value = "" }: IntegrationSearchProps) {
  const [inputValue, setInputValue] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setInputValue(value);
  }, [value]);
  return (
    <div className={styles.searchWrapper}>
      <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
      <input
        className={styles.searchInput}
        ref={ref}
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          onSearch(e.target.value);
        }}
      />
      <FontAwesomeIcon
        className={styles.clearIcon}
        icon={faTimes}
        onClick={() => {
          setInputValue("");
          onSearch("");
          ref.current?.focus();
        }}
      />
    </div>
  );
}
