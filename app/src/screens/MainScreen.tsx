import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

import { useENS } from '../ENSProvider';
import { useWallet } from '../WalletProvider';
import { spacing } from '../constants';
import useIsMoWeb from '../useIsMoWeb';
import useUser from '../useUser';
import MassiveJazzicon from '../views/MassiveJazzicon';
import PageContainer from '../views/PageContainer';
import Typography from '../views/Typography';
import ConnectSection from './ConnectSection';
import SelectNFTSection from './SelectNFTSection';

export default function MainScreen() {
  const isMoWeb = useIsMoWeb();
  const { wallet } = useWallet();
  const { loading, user } = useUser();
  const { loading: loadingENS } = useENS();

  if (loading || loadingENS) {
    return (
      <PageContainer>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" />
        </View>
      </PageContainer>
    );
  }

  if (wallet && user) return <SelectNFTSection />;

  return (
    <>
      <PageContainer
        backgroundComponent={
          <>
            <MassiveJazzicon />
            <View style={{ position: 'absolute', opacity: 0.6, top: '70px', right: '-32px' }}>
              <FontAwesome5 name="ethereum" size={750} color="white" />
            </View>
          </>
        }
      >
        {isMoWeb && (!wallet || !user) && (
          <View>
            <Typography fontWeight={600} style={styles.subtitle}>
              davatar
            </Typography>
            <Typography>One avatar for everything Web3.</Typography>
          </View>
        )}

        <View>
          <Typography fontWeight={600} style={styles.subtitle} variant="header">
            davatar
          </Typography>
          <Typography>One avatar for everything Web3.</Typography>
        </View>

        <ConnectSection />

        {wallet && user && <SelectNFTSection />}
      </PageContainer>

      <View style={{ position: 'absolute', bottom: 0, height: '70px' }}>
        <Typography>SAVE.</Typography>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  spaced: {
    paddingTop: spacing(2),
  },
  subtitle: {
    color: '#5b58eb',
    paddingTop: spacing(2),
    paddingBottom: 24,
  },
  loaderContainer: {
    paddingTop: spacing(5),
    width: '100%',
    alignItems: 'center',
  },
});
