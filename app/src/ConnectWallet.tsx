import React, { useCallback } from 'react';

import { useWallet } from './WalletProvider';
import { httpsCallable, signInWithCustomToken } from './firebase';
import Button from './views/Button';

type Props = {
  onConnectSuccess?: () => void;
  onConnectFail?: () => void;
};

export default function ConnectWallet({ onConnectSuccess, onConnectFail }: Props) {
  const { connect } = useWallet();

  const connectWallet = useCallback(async () => {
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

      await signInWithCustomToken(result.data as string);

      if (onConnectSuccess) {
        onConnectSuccess();
      }
    } catch (e) {
      if (onConnectFail) {
        onConnectFail();
      }
    }
  }, [connect, onConnectFail, onConnectSuccess]);

  return <Button title="Connect Wallet" onPress={connectWallet} />;
}
