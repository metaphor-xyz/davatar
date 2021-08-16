import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import Web3 from 'web3';
import { withWalletConnect, useWalletConnect } from '@carlosdp/react-native-dapp';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WalletConnectProvider from "@walletconnect/web3-provider";

export interface Context {
  wallet: Web3 | null;
  address: string | null;
  connect: () => Promise<Web3 | null>;
  disconnect: () => void;
}

const WalletContext = createContext<Context>(null);

function WalletProvider(props: React.PropsWithChildren<{}>) {
  const [wallet, setWallet] = useState(null);
  const [address, setAddress] = useState(null);
  const connector = useWalletConnect();

  const connect = useCallback(async () => {
    if (!connector.connected) {
      connector.connect();
    }
    const provider = new WalletConnectProvider({
      connector,
      infuraId: "e6e57d41c8b2411ea434bf96efe69f08",
    });

    await provider.enable();

    const newWallet = new Web3(provider as any);
    const networkType = await newWallet.eth.net.getNetworkType();
    if (networkType !== "ropsten") {
      alert("Woah! Use Ropsten Test Network for now.");
      connector.killSession();
      throw new Error('must use ropsten');
    }

    const accounts = await newWallet.eth.getAccounts();

    if (accounts.length < 1) {
      return null;
    }

    setAddress(accounts[0]);
    setWallet(newWallet);

    return newWallet;
  }, [connector]);

  const disconnect = useCallback(() => {
    connector.killSession();
    setWallet(null);
    setAddress(null);
  }, [connector]);

  useEffect(() => {
    if (connector.connected) {
      connect();
    }
  }, [connect, connector]);

  return (
    <WalletContext.Provider value={{ wallet, address, connect, disconnect }}>
      {props.children}
    </WalletContext.Provider>
  );
}

export default withWalletConnect(WalletProvider, {
  redirectUrl: Platform.OS === 'web' ? window.location.origin : 'garnet://',
  storageOptions: {
    // @ts-ignore
    asyncStorage: AsyncStorage,
  },
});

export function useWallet() {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error('useWallet must be used inside WalletContext');
  }

  return context;
}

