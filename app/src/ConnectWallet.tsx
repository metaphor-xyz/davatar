import React, { useCallback, useState } from 'react';

import { useWallet } from './WalletProvider';
import AnimatedPointingButton from './views/AnimatedPointingButton';

type Props = {
  onConnectSuccess?: () => void;
  onConnectFail?: () => void;
  disableAnimation?: boolean;
};

export default function ConnectWallet({ onConnectSuccess, onConnectFail, disableAnimation }: Props) {
  const { connect, connecting } = useWallet();
  const [signing, setSigning] = useState(false);

  const connectWallet = useCallback(async () => {
    // Connect the wallet
    try {
      setSigning(true);

      const wallet = await connect();

      if (!wallet) {
        throw new Error('no wallet connected');
      }

      // const accounts = await wallet.eth.getAccounts();
      // const address = accounts[0];

      // const challenge = await httpsCallable('connectWallet')({ address });

      // const signature = await signMessage(challenge.data as string, wallet);

      // const result = await httpsCallable('connectWallet')({
      //   address,
      //   signature,
      // });

      // await signInWithCustomToken(result.data as string);

      if (onConnectSuccess) {
        onConnectSuccess();
      }
    } catch (e) {
      if (e.message !== 'User close QRCode Modal' && e.message !== 'User closed modal') {
        if (onConnectFail) {
          onConnectFail();
        }
      }
    } finally {
      setSigning(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connect, onConnectFail, onConnectSuccess]);

  return (
    <AnimatedPointingButton
      title="Connect Wallet"
      onPress={connectWallet}
      disableAnimation={disableAnimation}
      loading={connecting || signing}
    />
  );
}
