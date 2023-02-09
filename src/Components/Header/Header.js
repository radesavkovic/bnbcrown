import React, { useEffect, useState } from "react";

import FunctionButton from "./FunctionButton/FunctionButton";
import { MenuOutlined } from "@ant-design/icons";
import { useIsMobileView } from "../../hooks/useIsMobileView";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import WalletMenu from "../WalletMenu/WalletMenu";
import styles from "./Header.module.scss";

const MENU = {
  TELEGRAM: (
    <Menu
      items={[
        {
          key: "1",
          label: (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://t.me/BnbCrown"
            >
              Group
            </a>
          ),
        },
        {
          key: "2",
          label: (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://t.me/BnbCrownChannel"
            >
              Channel
            </a>
          ),
        },
      ]}
    />
  ),
  AUDIT: (
    <Menu
      items={[
        {
          key: "1",
          label: (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://hazecrypto.net/audit/BNBCrown"
            >
              Haze Crypto
            </a>
          ),
        },
        {
          key: "2",
          label: (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://georgestamp.xyz/2022/08/bnb-crown/"
            >
              George Stamp
            </a>
          ),
        },
      ]}
    />
  ),
};

const Header = () => {
  const isMobileView = useIsMobileView();
  const [menuCollapsed, setMenuCollapsed] = useState(isMobileView || false);

  useEffect(() => {
    if (isMobileView) {
      setMenuCollapsed(true);
    } else {
      setMenuCollapsed(false);
    }
  }, [isMobileView]);

  const toggleMenu = () => {
    if (isMobileView) {
      setMenuCollapsed(!menuCollapsed);
    }
  };
  return (
    <div className={styles.header}>
      {/* {isMobileView && (
        // <MenuOutlined className={styles.menuIcon} onClick={toggleMenu} />
        <img
          src="./static/images/header/crown.png"
          alt="crown"
          onClick={toggleMenu}
          className={styles.menuIcon}
        />
      )} */}
      {/* {!menuCollapsed && !isMobileView && (
        <div className={styles.iconWrap}>
          <img src="./static/images/header/headerlogo.png" alt="bnb crown" />
        </div>
      )} */}

      <div className={styles.iconWrap}>
        {isMobileView && (
          <>
            <MenuOutlined className={styles.menuIcon} onClick={toggleMenu} />
            <Link to={"/"}>
              <img
                src="./static/images/header/headerlogo.png"
                alt="bnb crown"
              />
            </Link>
          </>
        )}
        {!isMobileView && (
          <img src="./static/images/header/headerlogo.png" alt="bnb crown" />
        )}
      </div>

      {!menuCollapsed && (
        <div className={styles.functionWrapper}>
          {/*<FunctionButton title="Support" isBorder={true} />*/}
          <FunctionButton
            title="Telegram"
            isBorder
            bgColor="#0088CC"
            isDropdown
            menu={MENU.TELEGRAM}
          />
          <FunctionButton
            title="Medium"
            isBorder
            bgColor="#f2b617"
            // isDropdown
            link="https://bnbcrown.medium.com/"
          />
          <FunctionButton
            title="Twitter"
            isBorder
            bgColor="#1DA1F2"
            // isDropdown
            link="https://twitter.com/BnbCrownMiner"
          />
          <FunctionButton
            title="Audit"
            isBorder
            bgColor="#126CF3"
            isDropdown
            menu={MENU.AUDIT}
          />
          <FunctionButton
            title="Presentation"
            isBorder
            bgColor="#F36312"
            link={"/static/presentation.pdf"}
            // isDropdown
          />
        </div>
      )}
      <WalletMenu />
    </div>
  );
};

export default Header;
