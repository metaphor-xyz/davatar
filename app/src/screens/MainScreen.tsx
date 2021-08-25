import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

import { useWallet } from '../WalletProvider';
import { spacing } from '../constants';
import useUser from '../useUser';
import PageContainer from '../views/PageContainer';
import Typography from '../views/Typography';
import ConnectSection from './ConnectSection';
import SelectNFTSection from './SelectNFTSection';

export default function MainScreen() {
  const { wallet } = useWallet();
  const { loading, user } = useUser();

  return (
    <PageContainer>
      <Typography variant="header" style={styles.spaced}>
        davatar
      </Typography>

      <Typography style={styles.subtitle}>One avatar for everything Web3.</Typography>

      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" />
        </View>
      )}

      {!loading && (
        <>
          <ConnectSection />

          {wallet && user && <SelectNFTSection />}
        </>
      )}
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  spaced: {
    paddingTop: spacing(2),
  },
  subtitle: {
    paddingTop: spacing(2),
    fontSize: 20,
  },
  loaderContainer: {
    paddingTop: spacing(5),
    width: '100%',
    alignItems: 'center',
  },
});