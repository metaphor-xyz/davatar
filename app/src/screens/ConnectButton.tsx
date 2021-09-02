import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

import ConnectWallet from '../ConnectWallet';
import { useWallet } from '../WalletProvider';
import useUser from '../useUser';
import Typography from '../views/Typography';

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

  return (
    <>
      <ConnectWallet disableAnimation={disableAnimation} />

      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <Typography variant="caption">* Use the wallet that owns your ENS name</Typography>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  innerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 6,
    textAlign: 'center',
  },
});
