import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { spacing, VIEW_STEPS } from '../constants';
import ConnectedWalletBox from './ConnectedWalletBox';
import CustomModal from './CustomModal';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AccountModal({ navigation }: StackScreenProps<Record<string, any>>) {
  const onDisconnect = useCallback(() => {
    navigation.navigate(VIEW_STEPS.CONNECT);
  }, [navigation]);

  return (
    <CustomModal title="Connected Wallet">
      <View style={styles.innerContainer}>
        <ConnectedWalletBox onDisconnect={onDisconnect} />
      </View>
    </CustomModal>
  );
}

const styles = StyleSheet.create({
  innerContainer: {
    paddingTop: '16px',
    maxWidth: '100%',
  },
  spacing: {
    paddingTop: spacing(1),
  },
  addressContainer: {
    width: '100%',
    marginTop: spacing(1),
    border: 'solid rgba(0,0,0,0.1) 2px',
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    padding: spacing(2),
    paddingTop: spacing(2),
    paddingBottom: spacing(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  providerText: {
    fontSize: 12,
  },
  accountText: {
    paddingTop: spacing(1),
    fontSize: 18,
    fontWeight: '500',
  },
});
