import { useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import ConnectWallet from '../ConnectWallet';
import { useWallet } from '../WalletProvider';
import { spacing, VIEW_STEPS } from '../constants';
import useUser from '../useUser';
import PageContainer from '../views/PageContainer';

export default function ConnectScreen({ navigation }) {
  const { wallet } = useWallet();
  const route = useRoute();
  const { loggedIn, authReady, user } = useUser();

  useEffect(() => {
    if (loggedIn && !!wallet && route.name === VIEW_STEPS.CONNECT) {
      if (user && user.currentAvatar) {
        navigation.navigate(VIEW_STEPS.SELECT_SOCIAL_WEBSITES);
      } else {
        navigation.navigate(VIEW_STEPS.SELECT_NFT);
      }
    }
  }, [loggedIn, user, wallet, navigation, route]);

  const onConnectFail = useCallback(() => {
    navigation.navigate(VIEW_STEPS.ERROR);
  }, [navigation]);

  if (!authReady) {
    return (
      <PageContainer>
        <ActivityIndicator size="large" />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Text style={styles.headerText}>Connect your wallet</Text>

      <View style={styles.content}>
        <ConnectWallet onConnectFail={onConnectFail} />
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing(2),
    flex: 1,
    justifyContent: 'center',
    minHeight: '275px',
  },
  headerText: {
    fontSize: 48,
    fontWeight: '600',
    paddingTop: spacing(2),
  },
});
