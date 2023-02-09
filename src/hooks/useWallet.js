import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  useCallback,
} from "react";
import { message } from "antd";
import detectEthereumProvider from "@metamask/detect-provider";
// import WalletConnectProvider from "@walletconnect/web3-provider";
import PropTypes from "prop-types";
import { ethers } from "ethers";
import { toHex } from "../utils/utils";
import { WALLET } from "../constants/wallets";

import { CHAINS } from "../constants/chains";

const TARGET_CHAIN = CHAINS.BSC;

const DEFAULT_RPC = TARGET_CHAIN.rpc[0];

const walletContext = createContext();

export const useWallet = () => useContext(walletContext);

// Provider hook that creates auth object and handles state
function useProvideWallet() {
  const [account, setAccount] = useState(null);
  const [ethersProvider, setEthersProvider] = useState(
    new ethers.providers.JsonRpcProvider(DEFAULT_RPC)
  );

  const resetDefault = useCallback(() => {
    setAccount(null);
    setEthersProvider(new ethers.providers.JsonRpcProvider(DEFAULT_RPC));
  }, []);

  const disconnect = async () => {
    resetDefault();
    try {
      await ethersProvider.provider.disconnect(); // end walletconnect session
    } catch (err) {
      console.error("no disconnect func");
    }
    sessionStorage.removeItem("wallet");
    window.location.reload();
  };

  // connect to chain
  const connect = useCallback(async (wallet = WALLET.METAMASK) => {
    // helper: verify current chain with target
    const verifyChain = async (provider) => {
      // const chainId = parseInt(await provider.request({ method: 'eth_chainId' }), 16);
      const chainId = Number(await provider.request({ method: "eth_chainId" }));
      // console.log('current chainId:', chainId);
      return chainId === TARGET_CHAIN.chainId;
    };
    // handle chain change
    const handleChainChanged = async (provider) => {
      // add/switch chain to target chain
      if (!(await verifyChain(provider))) {
        const networkData = {
          chainId: toHex(TARGET_CHAIN.chainId),
          chainName: TARGET_CHAIN.name,
          nativeCurrency: TARGET_CHAIN.nativeCurrency,
          rpcUrls: TARGET_CHAIN.rpc,
          blockExplorerUrls: [TARGET_CHAIN.explorers[0].url],
        };
        console.log("networkData", networkData);

        await provider.request({
          method: "wallet_addEthereumChain",
          params: [networkData, null],
        });

        // verify chain switch
        if (!(await verifyChain(provider))) {
          message.error("Chain Error.");
          throw new Error("Chain switch failed");
        }
      }
    };

    try {
      let ethereumProvider;
      try {
        ethereumProvider = await detectEthereumProvider({ timeout: 1000 });
      } catch (err) {
        console.error(err);
      }
      // handle multi wallets
      let provider;
      // let tempProvider;
      switch (wallet) {
        // case WALLET.WALLETCONNECT.type:
        //   console.log(wallet.type);
        //   tempProvider = new WalletConnectProvider({
        //     rpc: {
        //       56: "https://bsc-dataseed1.binance.org",
        //     },
        //     chainId: 56,
        //     network: "binance",
        //   });
        //   //  Enable session (triggers QR Code modal)
        //   try {
        //     await tempProvider.enable();
        //     provider = tempProvider;
        //   } catch (err) {
        //     console.log(err);
        //   }
        //   break;
        case WALLET.ONTO.type:
          provider = window.onto || ethereumProvider;
          break;
        default:
          provider = ethereumProvider;
      }

      // handle no provider
      if (!provider) {
        console.log("No provider detected");
        window.open(
          wallet.link,
          "_blank" // <- This is what makes it open in a new window.
        );
        return;
      }

      // unlock wallet
      try {
        await provider.request({ method: "eth_requestAccounts" });
      } catch (err) {
        console.log("eth_requestAccounts failed");
      }

      // add event listener
      if (wallet.type !== WALLET.ONTO.type) {
        // listen to chainChanged
        provider.on("chainChanged", () => {
          window.location.reload();
        });

        // listen to accountsChanged
        provider.on("accountsChanged", () => {
          window.location.reload();
        });
      }

      // change chain
      await handleChainChanged(provider);

      // set ethersProvider
      setEthersProvider(new ethers.providers.Web3Provider(provider));

      // set auto connect
      sessionStorage.wallet = JSON.stringify(wallet);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (sessionStorage.wallet) {
      connect(JSON.parse(sessionStorage.wallet));
    }
  }, [connect]);

  useEffect(() => {
    let isMounted = true;
    const getAccounts = async () => {
      let tempAccount = null;
      if (ethersProvider instanceof ethers.providers.Web3Provider) {
        try {
          const accounts = await ethersProvider.send("eth_accounts", []);
          if (accounts.length !== 0) {
            tempAccount = accounts[0].toLowerCase();
          }
        } catch (err) {
          console.error("noWalletConnected", err);
        }
      }
      if (isMounted) {
        setAccount(tempAccount);
      }
    };
    getAccounts();
    return () => {
      isMounted = false;
    };
  }, [ethersProvider]);

  return {
    account,
    connect,
    disconnect,
    ethersProvider,
  };
}

export function ProvideWallet({ children }) {
  const wallet = useProvideWallet();
  return (
    <walletContext.Provider value={wallet}>{children}</walletContext.Provider>
  );
}

ProvideWallet.propTypes = {
  children: PropTypes.node.isRequired,
};
