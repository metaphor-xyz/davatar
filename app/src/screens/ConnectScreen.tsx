import { useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import ConnectWallet from '../ConnectWallet';
import { useWallet } from '../WalletProvider';
import { spacing, VIEW_STEPS } from '../constants';
import useUser from '../useUser';
import Button from '../views/Button';
import ConnectedWalletBox from '../views/ConnectedWalletBox';
import PageContainer from '../views/PageContainer';
import Typography from '../views/Typography';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ConnectScreen({ navigation }: StackScreenProps<Record<string, any>>) {
  const { wallet } = useWallet();
  const route = useRoute();
  const { loggedIn, loading: authLoading, user } = useUser();

  const onConnectSuccess = useCallback(() => {
    if (user && user.currentAvatar) {
      navigation.navigate(VIEW_STEPS.SELECT_SOCIAL_WEBSITES);
    } else {
      navigation.navigate(VIEW_STEPS.SELECT_NFT);
    }
  }, [navigation, user]);

  useEffect(() => {
    if (loggedIn && !!wallet && route.name === VIEW_STEPS.CONNECT) {
      onConnectSuccess();
    }
  }, [loggedIn, user, wallet, navigation, route, onConnectSuccess]);

  const onConnectFail = useCallback(() => {
    navigation.navigate(VIEW_STEPS.ERROR);
  }, [navigation]);

  if (!authLoading) {
    return (
      <PageContainer>
        <ActivityIndicator size="large" />
      </PageContainer>
    );
  }

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
          <ConnectWallet onConnectFail={onConnectFail} />
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
