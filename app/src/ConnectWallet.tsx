import { useWalletConnect } from '@carlosdp/react-native-dapp';
import React, { useCallback } from 'react';

import { useWallet } from './WalletProvider';
import { httpsCallable, signInWithCustomToken } from './firebase';
import Button from './views/Button';

type Props = {
  onConnectSuccess?: () => void;
  onConnectFail?: () => void;
};

export default function ConnectWallet({ onConnectSuccess, onConnectFail }: Props) {
  const connector = useWalletConnect();
  const { wallet: connectedWallet, connect } = useWallet();

  const connectWallet = useCallback(async () => {
    // Return if wallet is already connected
    if (connectedWallet) {
      if (onConnectSuccess) {
        onConnectSuccess();
      }
      return;
    }

    // Connect the wallet
    try {
      const wallet = await connect();

      if (!wallet) {
        throw new Error('no wallet connected');
      }

      const accounts = await wallet.eth.getAccounts();
      const address = accounts[0];

      const challenge = await httpsCallable('connectWallet')({ address });

      const signature = await wallet.eth.personal.sign(challenge.data as string, address, 'password');

      const result = await httpsCallable('connectWallet')({
        address,
        signature,
      });

      signInWithCustomToken(result.data as string);
      if (onConnectSuccess) {
        onConnectSuccess();
      }
    } catch (e) {
      if (e.message !== 'User close QRCode Modal' && e.message !== 'User closed modal') {
        if (onConnectFail) {
          onConnectFail();
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connector, connect, onConnectFail, connectedWallet, onConnectSuccess]);

  return <Button title="Connect Wallet" onPress={connectWallet} />;
}
