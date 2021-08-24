import React, { useCallback } from 'react';

import { useWallet } from './WalletProvider';
import { httpsCallable, signInWithCustomToken } from './firebase';
import Button from './views/Button';

type Props = {
  onConnectSuccess?: () => void;
  onConnectFail?: () => void;
};

export default function ConnectWallet({ onConnectSuccess, onConnectFail }: Props) {
  const { connect, signMessage } = useWallet();

  const connectWallet = useCallback(async () => {
    // Connect the wallet
    try {
      const wallet = await connect();

      if (!wallet) {
        throw new Error('no wallet connected');
      }

      const accounts = await wallet.eth.getAccounts();
      const address = accounts[0];

      const challenge = await httpsCallable('connectWallet')({ address });

      const signature = await signMessage(challenge.data as string, wallet);

      const result = await httpsCallable('connectWallet')({
        address,
        signature,
      });

      await signInWithCustomToken(result.data as string);

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
  }, [connect, onConnectFail, onConnectSuccess]);

  return (
    <>
      <Button title="Connect Wallet" onPress={connectWallet} />
    </>
  );
}
