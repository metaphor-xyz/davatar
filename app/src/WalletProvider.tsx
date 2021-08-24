import { withWalletConnect, useWalletConnect } from '@carlosdp/react-native-dapp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WalletConnectProvider from '@walletconnect/web3-provider';
import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import Web3 from 'web3';
import Web3Modal from 'web3modal';

export interface OpenSeaNFT {
  id: number;
  name: string;
  description: string;
  image_thumbnail_url: string;
  image_preview_url: string;
  image_url: string;
}

export interface Context {
  wallet: Web3 | null;
  address: string | null;
  connect: () => Promise<Web3 | null>;
  disconnect: () => void;
  connecting: boolean;
  nfts: OpenSeaNFT[];
}

const WalletContext = createContext<Context>(null!);

let web3Modal: Web3Modal | null = null;

function WalletProvider(props: React.PropsWithChildren<Record<string, never>>) {
  const [wallet, setWallet] = useState<Web3 | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const connector = useWalletConnect();
  const [connecting, setConnecting] = useState(false);
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    if (Platform.OS === 'web') {
      web3Modal = new Web3Modal({
        cacheProvider: true,
        providerOptions: {
          walletconnect: {
            package: WalletConnectProvider,
            options: {
              infuraId: 'e6e57d41c8b2411ea434bf96efe69f08',
            },
          },
        },
      });
    }
  }, []);

  const connect = useCallback(async () => {
    let newWallet: Web3 | null = null;

    setConnecting(true);

    try {
      if (Platform.OS === 'web') {
        if (web3Modal) {
          const provider = await web3Modal.connect();
          newWallet = new Web3(provider);
        }
      } else {
        if (!connector.connected) {
          await connector.connect();
        }
        const provider = new WalletConnectProvider({
          connector,
          infuraId: 'e6e57d41c8b2411ea434bf96efe69f08',
        });

        await provider.enable();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        newWallet = new Web3(provider as any);
      }

      if (newWallet) {
        const accounts = await newWallet.eth.getAccounts();

        if (accounts.length < 1) {
          return null;
        }

        // Load NFT information from OpenSea
        fetch(`https://api.opensea.io/api/v1/assets?owner=${accounts[0]}&order_direction=desc&offset=0&limit=50`)
          .then(res => res.json())
          .then(data => {
            if (data && data.assets) {
              setNfts(data.assets);
            }
          });

        setAddress(accounts[0]);
        setWallet(newWallet);
      }

      return newWallet;
    } finally {
      setConnecting(false);
    }
  }, [connector]);

  const disconnect = useCallback(() => {
    connector.killSession();
    setWallet(null);
    setAddress(null);
  }, [connector]);

  useEffect(() => {
    if (!wallet && !connecting) {
      if (Platform.OS === 'web' && web3Modal) {
        if (web3Modal.cachedProvider) {
          connect();
        }
      } else {
        if (connector.connected) {
          connect();
        }
      }
    }
  }, [wallet, connecting, connect, connector]);

  return (
    <WalletContext.Provider value={{ wallet, address, connect, disconnect, connecting, nfts }}>
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
