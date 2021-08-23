import { useNavigation } from '@react-navigation/native';
import React from 'react';

import ConnectWallet from '../ConnectWallet';
import { useWallet } from '../WalletProvider';
import { sliceWalletAddress, VIEW_STEPS } from '../constants';
import Button from './Button';

export default function ConnectWalletButton() {
  // eslint-disable-next-line
  const navigation: any = useNavigation();
  const { address } = useWallet();

  if (!address) return <ConnectWallet />;

  const slicedAddress = sliceWalletAddress(address);

  return <Button title={slicedAddress} onPress={() => navigation.navigate(VIEW_STEPS.CONNECT_WALLET_MODAL)} />;
}
