import React from "react";
import numeral from 'numeral';

import styles from "./StakeCard.module.scss";
import classNames from "classnames";

const StakeCard = (props) => {
  const { info } = props;
  const { plan, state, startDate, endDate, amount, earn, percent, progress } = info;
  return (
    <div className={classNames(styles.stakeCard, plan >3 ? styles.blue : '')}>
      <div className={styles.planTitle}>
        <p className={styles.type}>{`Plan ${plan}`}</p>
        <p className={styles.state}>{state}</p>
        <p className={styles.time}>{`${startDate} - ${endDate}`}</p>
      </div>
      <div className={styles.planRate}>
        <p>{numeral(percent).format('0.[0]')}%</p>
      </div>
      <div className={styles.planDetail}>
        <div className={classNames(styles.infoItem, styles.left)}>
          <h1>{numeral(amount).format('0.[000]')}</h1>
          <p>Staked amount</p>
        </div>
        <div className={classNames(styles.infoItem, styles.right)}>
          <h1>{numeral(earn).format('0.[000]')}</h1>
          <p>Total Return</p>
        </div>
      </div>
      <div className={styles.progress}>
        <div className={styles.inner} style={{width: `${progress}%`}}>
          <div className={styles.percentage}>{numeral(progress).format('0.[00]%')}</div>
        </div>
      </div>
    </div>
  );
};

export default StakeCard;
