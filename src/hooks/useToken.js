import { ethers } from "ethers";
import { useEffect, useReducer } from "react";
import { FETCH_STATE, readContractReducer } from "../utils/utils";
import { useERC20Contract } from "./useContract";
import { useIsMounted } from "./useIsMounted";
import { useUpdate } from "./useUpdate";
import { useWallet } from "./useWallet";

export const useTokenBalance = (tokenAddress, accountAddress = null) => {
  const [state, dispatch] = useReducer(readContractReducer, {
    isLoading: false,
    isError: false,
    data: null,
  });
  const tokenContract = useERC20Contract(tokenAddress);
  const { account, ethersProvider } = useWallet();
  const isMounted = useIsMounted();
  const { updateByTimer } = useUpdate();

  useEffect(() => {
    const fetchData = async () => {
      const { utils } = ethers;

      try {
        if (
          !(
            ethersProvider &&
            tokenContract &&
            (ethers.utils.isAddress(accountAddress) || account)
          )
        ) {
          return;
        }
        dispatch({ type: FETCH_STATE.INIT });
        let data;
        if (parseInt(tokenAddress, 16) === 0) {
          data = await ethersProvider.getBalance(accountAddress || account);
        } else {
          data = await tokenContract.balanceOf(accountAddress || account);
        }
        if (isMounted.current) {
          dispatch({
            type: FETCH_STATE.SUCCESS,
            payload: Number(utils.formatEther(data)),
          });
        }
      } catch (error) {
        console.error(error);
        if (isMounted.current) {
          dispatch({ type: FETCH_STATE.FAILURE });
        }
      }
    };
    fetchData();
  }, [
    tokenContract,
    account,
    accountAddress,
    ethersProvider,
    isMounted,
    updateByTimer,
    tokenAddress,
  ]);
  return state;
};

export const useTokenAllowance = (
  tokenAddress,
  targetContractAddress,
  accountAddress = null
) => {
  const [state, dispatch] = useReducer(readContractReducer, {
    isLoading: false,
    isError: false,
    data: null,
  });
  const tokenContract = useERC20Contract(tokenAddress);
  const { account, ethersProvider } = useWallet();
  const isMounted = useIsMounted();
  const { updateByTimer } = useUpdate();

  useEffect(() => {
    const fetchData = async () => {
      const { utils } = ethers;

      try {
        if (
          !(
            targetContractAddress &&
            ethersProvider &&
            tokenContract &&
            (ethers.utils.isAddress(accountAddress) || account)
          )
        ) {
          return;
        }
        dispatch({ type: FETCH_STATE.INIT });
        const data = await tokenContract.allowance(
          accountAddress || account,
          targetContractAddress
        );
        if (isMounted.current) {
          dispatch({
            type: FETCH_STATE.SUCCESS,
            payload: Number(utils.formatEther(data)),
          });
        }
      } catch (error) {
        console.error(error);
        if (isMounted.current) {
          dispatch({ type: FETCH_STATE.FAILURE });
        }
      }
    };
    fetchData();
  }, [
    tokenContract,
    account,
    accountAddress,
    ethersProvider,
    isMounted,
    updateByTimer,
    targetContractAddress,
  ]);
  return state;
};

export const useTokenApprove = (tokenAddress) => {
  const [state, dispatch] = useReducer(readContractReducer, {
    isLoading: false,
    isError: false,
    data: null,
  });
  const tokenContract = useERC20Contract(tokenAddress);
  const isMounted = useIsMounted();

  const approve = async (
    targetAddress,
    amount = "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"
  ) => {
    try {
      if (!tokenContract) {
        return;
      }
      dispatch({ type: FETCH_STATE.INIT });
      const tx = await tokenContract.approve(targetAddress, amount);
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

  return { state, approve };
};
