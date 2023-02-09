import React, { useState } from "react";
import WALLET from "../../constants/wallets";
import { truncAddress } from "../../utils/utils";
import { useWallet } from "../../hooks/useWallet";
import CustomModal from "../UI/CustomModal/CustomModal";
import Button from "../UI/Button/Button";

import styles from "./WalletMenu.module.scss";

const WalletMenu = () => {
  const [walletListVisible, setWalletListVisible] = useState(false);
  const { account, connect, disconnect } = useWallet();

  const toggleWalletListVisible = () => {
    setWalletListVisible((prev) => !prev);
  };

  return (
    <div className={styles.WalletMenu}>
      {!account && (
        <Button
          className={styles.walletButton}
          onClick={toggleWalletListVisible}
        >
          Connect
        </Button>

        // <div className={styles.walletButton} onClick={toggleWalletListVisible}>
        //   {/* <FunctionButton title="Connect Wallet" bgColor="#F39C12" isSpecial /> */}
        // </div>
      )}
      {account && (
        <Button className={styles.walletButton} onClick={disconnect}>
          {truncAddress(account)}
        </Button>
        // <div className={styles.walletButton} onClick={disconnect}>

        //   {/* <FunctionButton
        //     title={truncAddress(account)}
        //     bgColor="#F39C12"
        //     isSpecial
        //   /> */}
        // </div>
      )}
      <CustomModal
        visible={walletListVisible}
        onCancel={toggleWalletListVisible}
        title={"Connect Wallet"}
      >
        <div className={styles.walletList}>
          {Object.values(WALLET).map((item) => (
            <div
              className={styles.walletItem}
              onClick={() => {
                connect(item);
                toggleWalletListVisible();
              }}
              key={item.type}
            >
              <img
                src={`/static/images/wallets/${item.type}.png`}
                alt={item.name}
              />
              <p>{item.name}</p>
            </div>
          ))}
        </div>
      </CustomModal>
    </div>
  );
};

WalletMenu.propTypes = {};

export default WalletMenu;
