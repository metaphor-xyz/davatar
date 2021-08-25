// @ts-ignore
import ENS, { getEnsAddress } from '@ensdomains/ensjs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

import { useWallet } from './WalletProvider';
import useUser from './useUser';

export interface Transaction {
  hash: string;
}

export default function useENS() {
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
      setLoading(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const provider = wallet.currentProvider as any;
      const ens = new ENS({ provider, ensAddress: getEnsAddress(provider.chainId) });
      ens
        .getName(address)
        .then((ensName: { name: string } | null) => setName(ensName?.name || null))
        .finally(() => setLoading(false));

      if (user && user.ipns) {
        const ipns = user.ipns;
        getAvatar().then(url => setConnected(url && url === `ipns://${ipns.replaceAll('ipns/', '')}`));
      }
    }
  }, [wallet, address, user, getAvatar, pendingTransaction]);

  return { name, setAvatar, getAvatar, loading, connected, pendingTransaction };
}
