import {useEffect, useReducer} from "react";
import {ethers} from "ethers";

import {readContractReducer, FETCH_STATE, PLAN_TYPE, checkTime, simpleMonth} from "../utils/utils";
import { multicallHelper } from "../utils/multicall";
import {useBNBCrownContract, useMulticallContract} from "./useContract";
import { useIsMounted } from "./useIsMounted";
import { useWallet } from "./useWallet";
import { useUpdate } from "./useUpdate";
import BNBCROWN_ABI from "../abis/bnbCrown.json";

export const useGlobalData = () => {
  const [state, dispatch] = useReducer(readContractReducer, {
    isLoading: false,
    isError: false,
    data: [],
  });
  const BNBCrownContract = useBNBCrownContract();
  const multicallContract = useMulticallContract();
  const isMounted = useIsMounted();
  const { updateByTimer } = useUpdate();
  const { account } = useWallet();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!(BNBCrownContract && account)) {
          return;
        }
        dispatch({ type: FETCH_STATE.INIT });

        const totalInvestors = (await BNBCrownContract.totalInvestors()).toNumber();

        const startTime = (await BNBCrownContract.startUNIX()).toNumber();

        const minInvestAmount = Number(ethers.utils.formatEther((await BNBCrownContract.INVEST_MIN_AMOUNT())));
        // get nft ids
        const calls = [];
        for(let i = 0; i <6; i++){
          calls.push([BNBCrownContract.address, "getPlanInfo", [i]]); // 1-6 time
          calls.push([BNBCrownContract.address, "getPercent", [i]]); //7-12 percent
        }
        const res = (
          await multicallHelper(multicallContract, BNBCROWN_ABI.abi, calls)
        )
        const planInfo = Array(6);

        for(let i = 0; i <6; i++){
          planInfo[i]={
            id:i+1,
            rate:res[i*2 + 1][0].toNumber() / 1000,
            period: res[i*2].time.toNumber(),
            type: i < 3 ? PLAN_TYPE.SIMPLE : PLAN_TYPE.COMPOUND
          }
        }

        if (isMounted.current) {
          dispatch({
            type: FETCH_STATE.SUCCESS,
            payload: {
              planInfo,
              startTime,
              totalInvestors,
              minInvestAmount
            },
          });
        }
      } catch (err) {
        console.error(err);
        if (isMounted.current) {
          dispatch({ type: FETCH_STATE.FAILURE });
        }
      }
    };
    fetchData();
  }, [
    BNBCrownContract,
    multicallContract,
    isMounted,
    updateByTimer,
    account,
  ]);

  return state;
};

export const useUserInfo = () => {
  const [state, dispatch] = useReducer(readContractReducer, {
    isLoading: false,
    isError: false,
    data: [],
  });
  const BNBCrownContract = useBNBCrownContract();
  const multicallContract = useMulticallContract();
  const isMounted = useIsMounted();
  const { updateByTimer } = useUpdate();
  const { account } = useWallet();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!(BNBCrownContract && account)) {
          return;
        }
        dispatch({ type: FETCH_STATE.INIT });

        const calls = [];
        calls.push([BNBCrownContract.address, "getUserTotalDeposits", [account]]);
        calls.push([BNBCrownContract.address, "getUserAvailable", [account]]);
        calls.push([BNBCrownContract.address, "getUserReferralWithdrawn", [account]]);
        calls.push([BNBCrownContract.address, "getUserReferralTotalBonus", [account]]);
        calls.push([BNBCrownContract.address, "getUserDownlineCount", [account]]);

        const res =  await multicallHelper(multicallContract, BNBCROWN_ABI.abi, calls);

        const totalStaked = Number(ethers.utils.formatEther(res[0][0]));
        const available = Number(ethers.utils.formatEther(res[1][0]));
        const referralWithdrawn = Number(ethers.utils.formatEther(res[2][0]));
        const referralEarned = Number(ethers.utils.formatEther(res[3][0]));
        const directInvited = res[4][0].toNumber();
        const totalInvited = res[4][0].toNumber() + res[4][1].toNumber() + res[4][2].toNumber();

        const userAmountOfDeposits = (await BNBCrownContract.getUserAmountOfDeposits(account)).toNumber();
        // get nft ids
        const depositInfoCalls = [];
        for(let i = 0; i <userAmountOfDeposits; i++){
          depositInfoCalls.push([BNBCrownContract.address, "getUserDepositInfo", [account, i]]);
        }
        const depositInfo = (
          await multicallHelper(multicallContract, BNBCROWN_ABI.abi, depositInfoCalls)
        ).map((item,index) => {
          const startDate = new Date(item.start * 1000);
          const startMonth = simpleMonth(startDate.getMonth());
          const startDay = startDate.getDate();

          const endDate = new Date(item.finish * 1000);
          const endMonth = simpleMonth(endDate.getMonth());
          const endDay = endDate.getDate()
          const progress =  Math.min((new Date().getTime() / 1000 - item.start) / (item.finish - item.start) * 100, 100)
          return {
          key: index,
          plan: item.plan+1,
          state: checkTime(item.finish*1000) ? "Ended" : "Active",
          startDate: `${startDay} ${startMonth}`,
          endDate: `${endDay} ${endMonth}`,
          amount: Number(ethers.utils.formatEther(item.amount)),
          earn: Number(ethers.utils.formatEther(item.profit)),
          progress:progress,
          percent: item.percent.toNumber() / 10,
        }})

        if (isMounted.current) {
          dispatch({
            type: FETCH_STATE.SUCCESS,
            payload: {
              depositInfo,
              totalStaked,
              available,
              referralWithdrawn,
              referralEarned,
              totalInvited,
              directInvited
            },
          });
        }
      } catch (err) {
        console.error(err);
        if (isMounted.current) {
          dispatch({ type: FETCH_STATE.FAILURE });
        }
      }
    };
    fetchData();
  }, [
    BNBCrownContract,
    multicallContract,
    isMounted,
    updateByTimer,
    account,
  ]);

  return state;
};


export const useInvest = () => {
  const [state, dispatch] = useReducer(readContractReducer, {
    isLoading: false,
    isError: false,
    data: null,
  });
  const BNBCrownContract = useBNBCrownContract();
  const isMounted = useIsMounted();

  const invest = async (amount, plan, referral) => {
    try {
      const { utils } = ethers;
      if (!BNBCrownContract) {
        return;
      }
      dispatch({ type: FETCH_STATE.INIT });
      const tx = await BNBCrownContract.invest(
        referral,
        plan - 1, {value: utils.parseEther(amount)}
      );

      console.log("tx", tx);
      const receipt = await tx.wait();
      console.log("receipt", receipt);
      if (isMounted.current) {
        dispatch({ type: FETCH_STATE.SUCCESS, payload: null });
      }
    } catch (error) {
      console.log(error);
      if (isMounted.current) {
        dispatch({ type: FETCH_STATE.FAILURE });
      }
    }
  };

  return { state, invest };
};

export const useClaim = () => {
  const [state, dispatch] = useReducer(readContractReducer, {
    isLoading: false,
    isError: false,
    data: null,
  });
  const BNBCrownContract = useBNBCrownContract();
  const isMounted = useIsMounted();

  const claim = async () => {
    try {
      if (!BNBCrownContract) {
        return;
      }
      dispatch({ type: FETCH_STATE.INIT });
      const tx = await BNBCrownContract.withdraw();

      console.log("tx", tx);
      const receipt = await tx.wait();
      console.log("receipt", receipt);
      if (isMounted.current) {
        dispatch({ type: FETCH_STATE.SUCCESS, payload: null });
      }
    } catch (error) {
      console.log(error);
      if (isMounted.current) {
        dispatch({ type: FETCH_STATE.FAILURE });
      }
    }
  };

  return { state, claim };
};
