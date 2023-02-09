import React, { useState } from "react";
import { ethers } from "ethers";
import { Row, Col, Input, message } from "antd";
import classNames from "classnames";
import styles from "./PlanCard.module.scss";
import numeral from "numeral";
import {
  checkTime,
  MIN_DEPOSIT,
  PLAN_TYPE,
  START_TIME,
} from "../../../utils/utils";
import Button from "../../UI/Button/Button";
import { useTokenBalance } from "../../../hooks/useToken";
import { DEFAULT_INVITER, TOKENS } from "../../../constants/addresses";
import { useWallet } from "../../../hooks/useWallet";
import { useGlobalData, useInvest } from "../../../hooks/useBNBCrown";
import { useQuery } from "../../../hooks/useQuery";

const PlanCard = (props) => {
  const { account } = useWallet();
  const { data: nativeBalance } = useTokenBalance(TOKENS.NATIVE);
  const { state: investState, invest } = useInvest();
  const { data: globalData } = useGlobalData();
  let queryInviterAddress = useQuery()?.get("ref");
  const startTime = globalData.startTime * 1000 || START_TIME;

  const { info } = props;
  const { id, rate, period, type } = info;

  const minInvestAmount = globalData.minInvestAmount || MIN_DEPOSIT;
  const [stakeAmount, setStakeAmount] = useState(minInvestAmount.toString());

  const stakeAmountChangeHandler = (e) => {
    const value = e.target.value;
    if (Number.isNaN(Number(value))) {
      return;
    }
    setStakeAmount(value);
  };

  const stake = () => {
    if (!checkTime(startTime)) {
      message.info("Coming soon");
      return;
    }

    if (investState?.isLoading) {
      return;
    }

    if (!account) {
      message.info("Please connect to wallet");
      return;
    }

    if (stakeAmount < minInvestAmount) {
      message.info("Minimum deposit is " + minInvestAmount + " BNB");
      return;
    }

    // check for gas
    if (nativeBalance < Number(stakeAmount) + 0.01) {
      message.info("Insufficient BNB Balance");
      return;
    }
    if (!ethers.utils.isAddress(queryInviterAddress)) {
      queryInviterAddress = DEFAULT_INVITER;
    }
    invest(stakeAmount, id, queryInviterAddress);
  };

  let totalReturnRate, withdrawTime, colorTheme, footNote, blue;
  switch (type) {
    case PLAN_TYPE.SIMPLE:
      totalReturnRate = rate * period;
      withdrawTime = "Any Time";
      break;
    case PLAN_TYPE.COMPOUND:
      totalReturnRate = (1 + rate) ** period - 1;
      withdrawTime = "End of Plan";
      colorTheme = styles.blue;
      footNote = "* plan use auto compounding";
      blue = true;
      break;
    default:
  }
  const calculatedReturn = Number(stakeAmount) * totalReturnRate;

  return (
    <div className={classNames(styles.planCard, colorTheme)}>
      <div className={classNames(styles.planBar)}>{`Plan ${id}`}</div>
      <div className={styles.profitDetail}>
        <Row gutter={[0, 20]}>
          <Col span={12}>
            <p className={styles.detailTitle}>Daily Profit</p>
            <p className={styles.detailValue}>
              {numeral(rate).format("0.[0]%")}
            </p>
          </Col>
          <Col span={12}>
            <p className={styles.detailTitle}>Total Return</p>
            <p className={styles.detailValue}>
              {numeral(totalReturnRate).format("0.[0]%")}
            </p>
          </Col>
          <Col span={12}>
            <p className={styles.detailTitle}>Withdraw time</p>
            <p className={styles.detailValue} style={{ fontSize: "28px" }}>
              {withdrawTime}
            </p>
          </Col>
          <Col span={12}>
            <p className={styles.detailTitle}>Days</p>
            <p className={styles.detailValue}>{period}</p>
          </Col>
          <Col span={24}>
            <p className={styles.detailTitle}>Enter Amount</p>
            <Input value={stakeAmount} onChange={stakeAmountChangeHandler} />
          </Col>
        </Row>
      </div>

      <div className={styles.getBnb}>
        <p className={styles.detailTitle} style={{ margin: 0 }}>
          In {period} Days You will Get
        </p>
        <p className={styles.detailValue}>
          {numeral(calculatedReturn).format("0.[000]")}
        </p>
      </div>
      <Button
        className={styles.button}
        onClick={stake}
        disabled={!(calculatedReturn > 0 && account)}
        blue={blue}
      >
        Stake
      </Button>
      <p className={styles.footNote}>{footNote}</p>
    </div>
  );
};

export default PlanCard;
