import { useRoute } from '@react-navigation/native';
import React, { useCallback, useState, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import ConnectWallet from '../ConnectWallet';
import { useWallet } from '../WalletProvider';
import { spacing, VIEW_STEPS } from '../constants';
import { onAuthStateChanged } from '../firebase';
import Button from '../views/Button';
import ConnectedWalletBox from '../views/ConnectedWalletBox';
import PageContainer from '../views/PageContainer';
import Typography from '../views/Typography';

export default function ConnectScreen({ navigation }) {
  const [authReady, setAuthReady] = useState(false);
  // eslint-disable-next-line
  const [user, setUser] = useState<any | null>(null);
  const { wallet } = useWallet();
  const route = useRoute();

  useEffect(() => {
    return onAuthStateChanged(u => {
      setUser(u);
      setAuthReady(true);
    });
  }, [route.name]);

  useEffect(() => {
    if (!!user && !!wallet && route.name === VIEW_STEPS.CONNECT) {
      navigation.navigate(VIEW_STEPS.SELECT_NFT);
    }
  }, [user, wallet, navigation, route.name]);

  const onConnectSuccess = useCallback(() => {
    navigation.navigate(VIEW_STEPS.SELECT_NFT);
  }, [navigation]);

  const onConnectFail = useCallback(() => {
    navigation.navigate(VIEW_STEPS.ERROR);
  }, [navigation]);

  if (!authReady)
    return (
      <PageContainer>
        <ActivityIndicator size="large" />
      </PageContainer>
    );

  return (
    <PageContainer>
      <Typography variant="header" style={styles.spaced}>
        Connect your wallet
      </Typography>

      {user && wallet && (
        <>
          <View style={styles.content}>
            <ConnectedWalletBox />
          </View>
          <View style={styles.continueButton}>
            <Button fullWidth title="Continue" onPress={onConnectSuccess} />
          </View>
        </>
      )}

      {(!user || !wallet) && (
        <View style={styles.content}>
          <ConnectWallet onConnectSuccess={onConnectSuccess} onConnectFail={onConnectFail} />
        </View>
      )}
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing(2),
    flex: 1,
    justifyContent: 'center',
    minHeight: '275px',
    maxWidth: '100%',
  },
  spaced: {
    paddingTop: spacing(2),
  },

  continueButton: {
    width: '100%',
    alignItems: 'center',
    paddingTop: spacing(2),
  },
});
