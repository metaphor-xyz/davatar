import React, { createContext, useState, useContext } from 'react';
import Web3 from 'web3';

export interface Context {
  wallet: Web3 | null;
  setWallet: (wallet: Web3) => void;
}

const WalletContext = createContext<Context>(null);

export default function WalletProvider(props: React.PropsWithChildren<{}>) {
  const [wallet, setWallet] = useState(null);

  return (
    <WalletContext.Provider value={{ wallet, setWallet }}>
      {props.children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error('useWallet must be used inside WalletContext');
  }

  return context;
}

