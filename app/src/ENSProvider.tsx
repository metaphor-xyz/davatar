// @ts-ignore
import ENS, { getEnsAddress } from '@ensdomains/ensjs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useState, createContext, useContext } from 'react';

import { useWallet } from './WalletProvider';
import useUser from './useUser';

export interface Transaction {
  hash: string;
}

export interface Context {
  name: string | null;
  setAvatar: (_url: string) => Promise<Transaction>;
  getAvatar: () => Promise<string | null>;
  loading: boolean;
  connected: boolean;
  pendingTransaction: Transaction | null;
}

const ENSContext = createContext<Context>(null!);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ENSProvider({ children }: React.PropsWithChildren<Record<string, any>>) {
  const { wallet, address } = useWallet();
  const [name, setName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const { user } = useUser();
  const [pendingTransaction, setPendingTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    if (wallet) {
      AsyncStorage.getItem('pendingTransaction').then(hash => {
        if (hash) {
          wallet.eth.getTransaction(hash).then(tx => {
            if (tx.blockHash) {
              AsyncStorage.removeItem('pendingTransaction');
            } else {
              setPendingTransaction(tx);
            }
          });
        }
      });
    }
  }, [wallet]);

  useEffect(() => {
    if (wallet && pendingTransaction) {
      const sub = wallet.eth.subscribe('newBlockHeaders', async () => {
        const tx = await wallet.eth.getTransaction(pendingTransaction.hash);
        if (tx.blockHash) {
          setPendingTransaction(null);
          AsyncStorage.removeItem('pendingTransaction');
        }
      });

      return () => {
        sub.unsubscribe();
      };
    }
  }, [pendingTransaction, wallet]);

  const getAvatar = useCallback(async () => {
    if (wallet && name) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const provider = wallet.currentProvider as any;
      const ens = new ENS({ provider, ensAddress: getEnsAddress(provider.chainId) });
      const n = ens.name(name);
      return await n.getText('avatar');
    }
  }, [wallet, name]);

  const setAvatar = useCallback(
    async (url: string) => {
      if (wallet && name) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const provider = wallet.currentProvider as any;
        const ens = new ENS({ provider, ensAddress: getEnsAddress(provider.chainId) });
        const n = ens.name(name);
        const transaction = await n.setText('avatar', url);
        const tx = await wallet.eth.getTransaction(transaction.hash);
        setPendingTransaction(tx);
        AsyncStorage.setItem('pendingTransaction', transaction.hash);

        return transaction;
      }
    },
    [wallet, name]
  );

  useEffect(() => {
    if (wallet) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const provider = wallet.currentProvider as any;
      const ens = new ENS({ provider, ensAddress: getEnsAddress(provider.chainId) });
      ens
        .getName(address)
        .then((ensName: { name: string } | null) => setName(ensName?.name || null))
        .finally(() => setLoading(false));

      if (user && user.avatarProtocol) {
        const uri = `${user.avatarProtocol}://${user.avatarId}`;
        getAvatar().then(url => setConnected(url && url === uri));
      }
    }
  }, [wallet, address, user, getAvatar, pendingTransaction]);

  return (
    <ENSContext.Provider value={{ name, setAvatar, getAvatar, loading, connected, pendingTransaction }}>
      {children}
    </ENSContext.Provider>
  );
}

export function useENS() {
  const context = useContext(ENSContext);

  if (!context) {
    throw new Error('useENS must be used inside ENSProvider');
  }

  return context;
}
