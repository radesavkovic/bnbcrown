import React from "react";
import { Dropdown } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";

import styles from "./FunctionButton.module.scss";
const FunctionButton = (props) => {
  const { title, isBorder, bgColor, isDropdown, isSpecial, link, menu } = props;
  return (
    <div
      className={styles.buttonWrapper}
      style={{
        border: isSpecial
          ? " 1px solid #f39c12"
          : isBorder
          ? "1px solid #FFFFFF"
          : "none",
        backgroundColor: bgColor,
      }}
    >
      {isDropdown ? (
        <Dropdown
          overlay={menu}
          placement="bottom"
          overlayClassName={styles.Dropdown}
        >
          <div>
            {title}
            <CaretDownOutlined />
          </div>
        </Dropdown>
      ) : (
        <a href={link} target="_blank" rel="noreferrer noopener">
          {title}
        </a>
      )}
    </div>
  );
};

export default FunctionButton;
