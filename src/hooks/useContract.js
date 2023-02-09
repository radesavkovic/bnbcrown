import { useMemo } from "react";
import { ethers, Contract } from "ethers";
import { useWallet } from "./useWallet";

import MULTICALL_ABI from "../abis/multicall.json";
import BNBCROWN_ABI from "../abis/bnbCrown.json";
import IERC20_ABI from "../abis/IERC20.json";

import {
  MULTICALL_ADDRESS,
  BNBCROWN_ADDRESS,
} from "../constants/addresses";


export const useMulticallContract = () => {
  const { ethersProvider } = useWallet();
  return useMemo(() => {
    if (!ethersProvider) {
      return null;
    }
    return new Contract(MULTICALL_ADDRESS, MULTICALL_ABI.abi, ethersProvider);
  }, [ethersProvider]);
};

export const useBNBCrownContract = () => {
  const { ethersProvider, account } = useWallet();
  return useMemo(() => {
    if (!(ethersProvider && ethers.utils.isAddress(BNBCROWN_ADDRESS))) {
      return null;
    }
    return account
      ? new Contract(BNBCROWN_ADDRESS, BNBCROWN_ABI.abi, ethersProvider.getSigner())
      : new Contract(BNBCROWN_ADDRESS, BNBCROWN_ABI.abi, ethersProvider);
  }, [account, ethersProvider]);
};

export const useERC20Contract = (address) => {
  const { ethersProvider, account } = useWallet();
  return useMemo(() => {
    if (!(ethersProvider && ethers.utils.isAddress(address))) {
      return null;
    }
    return account
      ? new Contract(address, IERC20_ABI.abi, ethersProvider.getSigner())
      : new Contract(address, IERC20_ABI.abi, ethersProvider);
  }, [ethersProvider, address, account]);
};
