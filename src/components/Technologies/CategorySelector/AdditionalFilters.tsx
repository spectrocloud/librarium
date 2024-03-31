import React, { useState } from "react";
import { Dropdown, Tag, MenuProps, Space } from 'antd';
import { fontAwesomeIcons } from "../../IconMapper/dynamicFontAwesomeImports";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PlusCircleOutlined } from '@ant-design/icons';
import styles from "./CategorySelector.module.scss";
import "./additionalFilters.antd.css";

export default function AdditionalFilters() {
  const items: MenuProps['items'] = [
    {
      label: 'FIPS',
      key: 'FIPS',
    },
    {
      label: 'Verified',
      key: 'Verified',
    },
    {
      label: 'Community',
      key: 'Community',
    },
  ];

  return(
    <div className={styles.wrapper}>
      <Space wrap>
        <Dropdown.Button menu={{ items }} icon={<PlusCircleOutlined />} placement="bottomCenter">
          Additional Filter
        </Dropdown.Button>
      </Space>
    </div>
  )
}
