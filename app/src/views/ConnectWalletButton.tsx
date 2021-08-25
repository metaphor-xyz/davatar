import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Image } from 'react-native';

import ConnectWallet from '../ConnectWallet';
import { useENS } from '../ENSProvider';
import { useWallet } from '../WalletProvider';
import { sliceWalletAddress, VIEW_STEPS } from '../constants';
import useUser from '../useUser';
import Button from './Button';
import Jazzicon from './Jazzicon';

export default function ConnectWalletButton() {
  // eslint-disable-next-line
  const navigation: any = useNavigation();
  const { address } = useWallet();
  const { user } = useUser();
  const { name } = useENS();

  if (!address || !user) return <ConnectWallet />;

  const slicedAddress = sliceWalletAddress(address);

  return (
    <Button
      title={name || slicedAddress}
      onPress={() => navigation.navigate(VIEW_STEPS.CONNECT_WALLET_MODAL)}
      preTextComponent={
        user.avatarPreviewURL ? (
          <Image style={styles.avatarImage} source={{ uri: user.avatarPreviewURL }} />
        ) : (
          <Jazzicon address={address} size={20} style={styles.avatarImage} />
        )
      }
    />
  );
}

const styles = StyleSheet.create({
  avatarImage: {
    height: '20px',
    width: '20px',
    borderRadius: 50,
    marginRight: '8px',
    backgroundColor: 'blue',
  },
});
