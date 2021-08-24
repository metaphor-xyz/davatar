import { withWalletConnect, useWalletConnect } from '@carlosdp/react-native-dapp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WalletConnectProvider from '@walletconnect/web3-provider';
import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';
import { ActivityIndicator, Avatar } from 'react-native-paper';
import Web3 from 'web3';
import Web3Modal from 'web3modal';

import { spacing } from './constants';
import { logout } from './firebase';
import CustomPaperModal from './views/CustomPaperModal';

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
  walletName: string | null;
  connect: () => Promise<Web3 | null>;
  disconnect: () => void;
  connecting: boolean;
  nfts: OpenSeaNFT[];
  signMessage: (_message: string, _wallet?: Web3) => Promise<string>;
}

const WalletContext = createContext<Context>(null!);

let web3Modal: Web3Modal | null = null;

function WalletProvider(props: React.PropsWithChildren<Record<string, never>>) {
  const [wallet, setWallet] = useState<Web3 | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const connector = useWalletConnect();
  const [connecting, setConnecting] = useState(false);
  const [nfts, setNfts] = useState([]);
  const [walletName, setWalletName] = useState<string | null>(null);
  const [isWalletConnect, setIsWalletConnect] = useState(false);
  const [signingExplanationOpen, setSigningExplanationOpen] = useState(false);

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
          if (provider.isMetaMask) {
            setWalletName('MetaMask');
          }
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

        setWalletName(provider.walletMeta?.name || null);
        setIsWalletConnect(true);

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
    if (Platform.OS === 'web') {
      if (web3Modal) {
        web3Modal.clearCachedProvider();
      }
    } else {
      connector.killSession();
    }
    setWallet(null);
    setAddress(null);
    setWalletName(null);
    setIsWalletConnect(false);
    logout();
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

  const signMessage = useCallback(
    async (message: string, overrideWallet?: Web3) => {
      const localWallet = overrideWallet || wallet;
      if (!localWallet) {
        throw new Error('wallet not connected');
      }

      const accounts = await localWallet.eth.getAccounts();
      setSigningExplanationOpen(true);
      try {
        const signature = await localWallet.eth.personal.sign(message, accounts[0], 'password');

        return signature;
      } finally {
        setSigningExplanationOpen(false);
      }
    },
    [wallet]
  );

  return (
    <WalletContext.Provider value={{ wallet, address, connect, disconnect, connecting, nfts, signMessage, walletName }}>
      {props.children}
      <CustomPaperModal visible={signingExplanationOpen}>
        <View style={styles.container}>
          <Text style={styles.infoText}>
            Please sign the message we just sent to your <Text style={styles.walletName}>{walletName}</Text> wallet in
            order to login!
          </Text>
          {!isWalletConnect && <ActivityIndicator size="large" />}
          {isWalletConnect && (
            <View style={styles.phoneAddition}>
              <Avatar.Icon size={72} icon="cellphone" />
              <Text style={styles.phoneText}>Check your phone</Text>
            </View>
          )}
        </View>
      </CustomPaperModal>
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

const styles = StyleSheet.create({
  container: {
    padding: spacing(1),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoText: {
    fontSize: 18,
    marginBottom: '20px',
  },
  walletName: {
    fontWeight: '600',
  },
  phoneAddition: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  phoneText: {
    fontSize: 18,
    marginTop: '20px',
    fontWeight: '500',
  },
});
