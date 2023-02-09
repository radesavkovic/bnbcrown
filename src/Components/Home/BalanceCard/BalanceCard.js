import React from "react";
import numeral from 'numeral';
import styles from "./BalanceCard.module.scss";
const BalanceCard = (props) => {
  const { title, value,link, linkTitle } = props;
  return (
    <div className={styles.balanceCardWrapper}>
      <div className={styles.colorBar} />
      <div className={styles.cardContent}>
        <h2>
          {title}
          {
            link &&
            <a href={link} target="_blank" rel="noreferrer noopener" className={styles.link}>
              {linkTitle}
            </a>
          }

        </h2>
        <p>{numeral(value).format('0,0.[000]')}</p>
      </div>
    </div>
  );
};

export default BalanceCard;
