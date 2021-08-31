import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import ConnectWallet from '../ConnectWallet';
import { useWallet } from '../WalletProvider';
import { spacing } from '../constants';
import useUser from '../useUser';

export default function ConnectSection() {
  const { wallet } = useWallet();
  const { loading, user } = useUser();

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (user && wallet) return null;

  return (
    <View style={styles.connectButton}>
      <ConnectWallet />
    </View>
  );
}

const styles = StyleSheet.create({
  connectButton: {
    width: '100%',
    minHeight: '275px',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing(2),
  },
});
