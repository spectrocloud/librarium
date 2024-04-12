import React, { useState } from "react";
import { Tag, Space, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import styles from "./CategorySelector.module.scss";
import "./additionalFilters.antd.css";

interface MenuItemProps {
  label: string;
  key: string;
}
interface AdditionalFiltersProps {
  selectAdditionalFilters: (additionalFilters: string[]) => void;
}

export default function AdditionalFilters({ selectAdditionalFilters }: AdditionalFiltersProps) {
  const [items, setItems] = useState<MenuItemProps[]>([
    {
      label: 'Verified',
      key: 'Verified',
    },
    {
      label: 'Community',
      key: 'Community',
    }
  ]);
  const [selectedItems, setSelectedItems] = useState<MenuItemProps[]>([]);

  const additionalMenu: MenuProps['items'] = [
    {
      label: 'Additional Filter',
      key: 'additionalFilter',
      icon: <PlusCircleOutlined />,
      children: items,
    },
  ];

  const loadMenu = (key: string) => {
    const selItem = items.find((item) => item.key === key);
    if (selItem) {
      const _selectedItems = [...selectedItems, selItem];
      selectAdditionalFilters(_selectedItems.map((item) => item.label));
      setSelectedItems(_selectedItems);
      setItems(items.filter((item) => item.key !== key))
    }
  };

  const removeItem = (key: string) => {
    const newItems = selectedItems.filter((item) => item.key !== key);
    setSelectedItems(newItems);
    setItems([...items, selectedItems.find((item) => item.key === key)!]);
    selectAdditionalFilters(newItems.map((item) => item.label));
  };

  return (
    <div className={styles.wrapper}>
      <Space>
        {selectedItems.map((item) => (
          <Tag key={item.key} closable onClose={()=>removeItem(item.key)}>{item.label}</Tag>
        ))}
        <Menu onClick={({key}) => loadMenu(key)} mode="horizontal" items={additionalMenu} />
      </Space>
    </div>
  );
}
