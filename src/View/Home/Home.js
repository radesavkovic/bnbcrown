import React, { useState, useEffect } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import CountUp from "react-countup";
import { Row, Col, List, message } from "antd";
import classnames from "classnames";
import numeral from 'numeral';
import MainContainer from "../../Components/UI/MainContainer/MainContainer";
import BalanceCard from "../../Components/Home/BalanceCard/BalanceCard";
import PlanCard from "../../Components/Home/PlanCard/PlanCard";
import StakeCard from "../../Components/Home/StakeCard/StakeCard";
import Countdown from "../../Components/UI/Countdown/Countdown";
import styles from "./Home.module.scss";
import { checkTime, PLAN_TYPE, START_TIME } from "../../utils/utils";
import { useWallet } from "../../hooks/useWallet";
import { useTokenBalance } from "../../hooks/useToken";
import { BNBCROWN_ADDRESS, TOKENS } from "../../constants/addresses";
import { useClaim, useGlobalData, useUserInfo } from "../../hooks/useBNBCrown";
import Button from "../../Components/UI/Button/Button";

const planInfo = [
  {
    id: 1,
    rate: 0.08,
    period: 14,
    type: PLAN_TYPE.SIMPLE,
  },
  {
    id: 2,
    rate: 0.065,
    period: 21,
    type: PLAN_TYPE.SIMPLE,
  },
  {
    id: 3,
    rate: 0.05,
    period: 28,
    type: PLAN_TYPE.SIMPLE,
  },
  {
    id: 4,
    rate: 0.08,
    period: 14,
    type: PLAN_TYPE.COMPOUND,
  },
  {
    id: 5,
    rate: 0.065,
    period: 21,
    type: PLAN_TYPE.COMPOUND,
  },
  {
    id: 6,
    rate: 0.05,
    period: 28,
    type: PLAN_TYPE.COMPOUND,
  },
];

const Home = () => {
  const { account } = useWallet();
  const { data: nativeBalance } = useTokenBalance(TOKENS.NATIVE);
  const { data: contractBalance } = useTokenBalance(
    TOKENS.NATIVE,
    BNBCROWN_ADDRESS
  );
  const { state: claimState, claim } = useClaim();
  const { data: globalData } = useGlobalData();
  const { data: userData } = useUserInfo();
  const [availableStart, setAvailableStart] = useState(0);

  const startTime = globalData.startTime * 1000 || START_TIME;
  const referralLink = `${window.location.origin}?ref=${account}`;
  const totalStaked = userData.totalStaked || "-";
  const available = userData.available || 0;
  const referralEarned = userData.referralEarned || "-";
  const referralWithdrawn = userData.referralWithdrawn || "-";
  const totalInvited = userData.totalInvited || "-";
  const directInvited = userData.directInvited || "-";

  useEffect(() => {
    let timer = setTimeout(() => {
      setAvailableStart(available);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [available]);

  const claimAvailable = () => {
    if (!checkTime(startTime)) {
      message.info("Coming soon");
      return;
    }
    if (claimState?.isLoading) {
      return;
    }

    if (!account) {
      message.info("Please connect to wallet");
      return;
    }

    // check for gas
    if (nativeBalance < 0.01) {
      message.info("Insufficient gas");
      return;
    }
    claim();
  };

  return (
    <div className={styles.home}>
      <MainContainer className={styles.mainContentWrapper}>
        <section className={styles.balanceInfo}>
          {/* <BalanceCard isContract balance={stakedBalance} /> */}
          <BalanceCard
            title={"Total Contract Balance"}
            value={contractBalance || "-"}
            link={`https://bscscan.com/address/${BNBCROWN_ADDRESS}`}
            linkTitle={'Contract'}
          />
          <BalanceCard
            title={"Total Investors"}
            value={globalData.totalInvestors || "-"}
          />
        </section>
        {!checkTime(startTime) && (
          <section className={styles.countdownWrap}>
            <h2>Launch in:</h2>
            <Countdown className={styles.countdown} timestamp={startTime} />
          </section>
        )}

        <section className={classnames(styles.mainIntro, styles.common)}>
          <img src="./static/images/home/mainIntro.png" alt="main" />
          <div className={styles.introWrapper}>
            <div className={styles.introContent}>
              <Row gutter={[8, 16]}>
                <Col span={8}>Total Income</Col>
                <Col span={16}>
                  <span>Based on your staking plan (From 5% to 8% daily)</span>
                </Col>
                <Col span={8}>Basic Interest Rate</Col>
                <Col span={16}>
                  <span>
                    +0.5% Every 24 Hours(0.02% hourly) - Only For New Deposits
                  </span>
                </Col>
                <Col span={8}>Minimal Deposit</Col>
                <Col span={16}>
                  <span>0.05 BNB,no maximal limit</span>
                </Col>
                <Col span={8}>Fees</Col>
                <Col span={16}>
                  <span>5% devs fees and 5% withdraw fees</span>
                </Col>
              </Row>
            </div>
            <p>
              Earning every moment,withdraw anytime (if you use auto-compounding
              you can withdraw only after end of your deposit)
            </p>
          </div>
        </section>

        <section className={styles.plans}>
          <List
            className={styles.selectorList}
            grid={{
              gutter: 16,
              xs: 1,
              sm: 1,
              md: 2,
              lg: 2,
              xl: 3,
              xxl: 3,
            }}
            dataSource={globalData.planInfo || planInfo}
            renderItem={(item) => (
              <List.Item>
                <PlanCard info={item} />
              </List.Item>
            )}
          />
        </section>

        <section className={styles.userInfo}>
          <div className={styles.referralWrapper}>
            <div className={styles.stakeSummary}>
              <img src="./static/images/home/referral.png" alt="referral" />
              <h6>Total Staked</h6>
              <span>{totalStaked}</span>
              <h6>Available BNB for withdraw</h6>
              <span>
                <CountUp
                  start={availableStart}
                  end={available}
                  duration={4}
                  decimals={6}
                  decimal="."
                />
              </span>

              <Button
                className={styles.withdrawButton}
                disabled={!(available > 0 && account)}
                onClick={claimAvailable}
              >
                Withdraw
              </Button>
            </div>
            <div className={styles.referralDetail}>
              <h6>Your referral link</h6>
              <div className={styles.referralLink}>
                <h6>{referralLink}</h6>
                <CopyToClipboard
                  text={referralLink}
                  onCopy={() => {
                    message.success("Referral link copied");
                  }}
                >
                  <img
                    src="./static/images/home/copy.png"
                    alt="copy"
                    style={{ cursor: "pointer" }}
                  />
                </CopyToClipboard>
              </div>
              <div className={styles.referralData}>
                <Row>
                  <Col span={12}>
                    <h6>Total Referral Earned</h6>
                    <span>{numeral(referralEarned).format('0,0.[000]')}</span>
                  </Col>
                  <Col span={12}>
                    <h6>Total Referral Withdrawn</h6>
                    <span>{numeral(referralWithdrawn).format('0,0.[000]')}</span>
                  </Col>
                  <Col span={12}>
                    <h6>Direct referred members</h6>
                    <span>{directInvited}</span>
                  </Col>
                  <Col span={12}>
                    <h6>Team members</h6>
                    <span>{totalInvited}</span>
                  </Col>
                </Row>
              </div>
              <div className={styles.referralBonus}>
                Earn for promotion BNBCrown <br />
                <br />
                You will receive: <br />
                <br />
                5% from each level 1 referral deposits <br />
                3% from each level 2 referral deposits <br />
                2% from each level 3 referral deposits <br />
                <br />
                You need to have at least 1 deposit to start receive earnings.
              </div>
            </div>
          </div>
        </section>
        {userData.depositInfo && userData.depositInfo.length > 0 && (
          <section className={styles.stakeDetail}>
            <List
              className={styles.selectorList}
              grid={{
                gutter: 16,
                xs: 1,
                sm: 2,
                md: 2,
                lg: 3,
                xl: 3,
                xxl: 3,
              }}
              dataSource={Object.values(userData.depositInfo)}
              renderItem={(item) => (
                <List.Item>
                  <StakeCard info={item} />
                </List.Item>
              )}
            />
          </section>
        )}
      </MainContainer>
    </div>
  );
};

export default Home;
