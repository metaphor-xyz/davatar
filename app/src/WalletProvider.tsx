import { getGatewayUrl } from '@davatar/react/dist/Image';
import { SafeAppWeb3Modal } from '@gnosis.pm/safe-apps-web3modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { withWalletConnect, useWalletConnect } from '@walletconnect/react-native-dapp';
import WalletConnectProvider from '@walletconnect/web3-provider';
import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';
import { ActivityIndicator, Avatar } from 'react-native-paper';
import Web3 from 'web3';

import { spacing } from './constants';
import { logout } from './firebase';
import CustomPaperModal from './views/CustomPaperModal';

interface ResNFT {
  id: string;
  identifier: string;
  uri: string;
  registry: { id: string };
}

export interface GraphNFT {
  type: 'erc721' | 'erc1155';
  id: string;
  contractId: string;
  tokenId: string;
  uri: string;
}

export interface Context {
  wallet: Web3 | null;
  address: string | null;
  walletName: string | null;
  connect: () => Promise<Web3 | null | undefined>;
  disconnect: () => void;
  connecting: boolean;
  nfts: GraphNFT[];
  signMessage: (_message: string, _wallet?: Web3) => Promise<string>;
  loadingWallet: boolean;
  loadingNfts: boolean;
  error?: string;
}

const WalletContext = createContext<Context>(null!);

let web3Modal: SafeAppWeb3Modal | null = null;

function WalletProvider(props: React.PropsWithChildren<Record<string, never>>) {
  const [wallet, setWallet] = useState<Web3 | null>(null);
  const [loadingWallet, setLoadingWallet] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const connector = useWalletConnect();
  const [connecting, setConnecting] = useState(false);
  const [nfts, setNfts] = useState<GraphNFT[]>([]);
  const [walletName, setWalletName] = useState<string | null>(null);
  const [isWalletConnect, setIsWalletConnect] = useState(false);
  const [signingExplanationOpen, setSigningExplanationOpen] = useState(false);
  const [loadingNfts, setLoadingNfts] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (Platform.OS === 'web') {
      web3Modal = new SafeAppWeb3Modal({
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
          const provider = await web3Modal.requestProvider();
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

        // Load NFT information from The Graph
        setLoadingNfts(true);
        fetch('https://api.thegraph.com/subgraphs/name/amxx/eip721-subgraph', {
          method: 'POST',
          headers: {
            'content-type': 'application/json;charset=UTF-8',
          },
          body: JSON.stringify({
            query: `
            {
              tokens(first: 100, where: { owner: "${accounts[0].toLowerCase()}" }) {
                id
                identifier
                uri
                registry {
                  id
                }
              }
            }
            `,
          }),
        })
          .then(res => res.json())
          .then(res => {
            if (res.data && res.data.tokens) {
              Promise.allSettled<GraphNFT>(
                res.data.tokens.map((t: ResNFT) => {
                  const id = t.id.split('-')[1];

                  return fetch(getGatewayUrl(t.uri, id))
                    .then(r => r.json())
                    .then((meta: { image: string }) => ({
                      type: 'erc721',
                      id: t.id,
                      contractId: t.registry.id,
                      tokenId: t.identifier,
                      uri: meta.image,
                    }));
                })
              ).then(results => {
                setNfts(
                  results
                    .filter(r => r.status === 'fulfilled')
                    // @ts-ignore
                    .map((r: PromiseFulfilledResult<GraphNFT>) => r.value)
                );
              });
              setError(undefined);
            }
          })
          .catch(() => {
            setError('Unable to load NFTs.');
          })
          .finally(() => setLoadingNfts(false));

        setAddress(accounts[0]);
        setWallet(newWallet);
      }

      return newWallet;
    } catch (e) {
      // eslint-disable-next-line
      console.error(e);
    } finally {
      setLoadingWallet(false);
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
          setLoadingWallet(true);
          connect();
        }
      } else {
        if (connector.connected) {
          setLoadingWallet(true);
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
    <WalletContext.Provider
      value={{
        wallet,
        address,
        connect,
        disconnect,
        connecting,
        nfts,
        signMessage,
        walletName,
        loadingWallet,
        loadingNfts,
        error,
      }}
    >
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
