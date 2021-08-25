import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

import { useWallet } from '../WalletProvider';
import { spacing } from '../constants';
import useIsMoWeb from '../useIsMoWeb';
import useUser from '../useUser';
import PageContainer from '../views/PageContainer';
import Typography from '../views/Typography';
import ConnectSection from './ConnectSection';
import SelectNFTSection from './SelectNFTSection';

export default function MainScreen() {
  const isMoWeb = useIsMoWeb();
  const { wallet } = useWallet();
  const { loading, user } = useUser();

  if (loading) {
    return (
      <PageContainer>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" />
        </View>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {isMoWeb && (!wallet || !user) && (
        <View>
          <Typography fontWeight={600} style={styles.subtitle}>
            davatar
          </Typography>
          <Typography>One avatar for everything Web3.</Typography>{' '}
        </View>
      )}

      <ConnectSection />

      {wallet && user && <SelectNFTSection />}
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
    paddingBottom: 4,
  },
  loaderContainer: {
    paddingTop: spacing(5),
    width: '100%',
    alignItems: 'center',
  },
});
