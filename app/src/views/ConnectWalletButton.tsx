import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { View } from 'react-native';

import { useENS } from '../ENSProvider';
import { useWallet } from '../WalletProvider';
import { sliceWalletAddress, VIEW_STEPS } from '../constants';
import useUser from '../useUser';
import Avatar from './Avatar';
import Button from './Button';

export default function ConnectWalletButton() {
  // eslint-disable-next-line
  const navigation: any = useNavigation();
  const { address, loadingWallet } = useWallet();
  const { user, loading: loadingUser } = useUser();
  const { name, loading: loadingENS } = useENS();

  const onPress = useCallback(() => {
    navigation.navigate(VIEW_STEPS.CONNECT_WALLET_MODAL);
  }, [navigation]);

  if (!address || !user || loadingWallet || loadingENS || loadingUser) return null;

  const slicedAddress = sliceWalletAddress(address);

  return (
    <Button
      title={name || slicedAddress}
      onPress={onPress}
      preTextComponent={
        <View style={{ marginRight: '8px' }}>
          <Avatar address={address} size={20} uri={user.avatarPreviewURL} />
        </View>
      }
    />
  );
}
