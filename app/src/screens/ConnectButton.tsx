import React from 'react';
import { ActivityIndicator } from 'react-native';

import ConnectWallet from '../ConnectWallet';
import { useWallet } from '../WalletProvider';
import useUser from '../useUser';

type Props = {
  disableAnimation?: boolean;
};

export default function ConnectButton({ disableAnimation }: Props) {
  const { wallet } = useWallet();
  const { loading, user } = useUser();

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (user && wallet) return null;

  return <ConnectWallet disableAnimation={disableAnimation} />;
}
