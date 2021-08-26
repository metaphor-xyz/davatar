import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';

import { useENS } from '../ENSProvider';
import { spacing } from '../constants';
import AnimatedButton from './AnimatedButton';
import Typography from './Typography';

type Props = {
  onSave: () => Promise<void>;
  disabled: boolean;
  loading?: boolean;
};

export default function SaveENS({ loading, disabled, onSave }: Props) {
  const { connected, loading: loadingENS, pendingTransaction } = useENS();

  const onClick = useCallback(async () => {
    await onSave();
  }, [onSave]);

  return (
    <View style={styles.container}>
      <View style={styles.saveButton}>
        <AnimatedButton
          title="Save davatar"
          loading={loading || loadingENS || !!pendingTransaction}
          disabled={disabled || loading || loadingENS || !!pendingTransaction}
          onPress={onClick}
        />
      </View>

      {!disabled && !connected && (
        <View style={styles.spaced}>
          <Typography style={styles.warning}>
            You will be charged a one-time gas fee. All subsequent updates are free!
          </Typography>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  saveButton: {
    height: 72,
    justifyContent: 'flex-end',
  },
  container: {
    zIndex: -2,
    paddingTop: spacing(6),
    display: 'flex',
    alignItems: 'center',
  },
  spaced: {
    paddingTop: spacing(2),
  },
  warning: {
    color: '#d32f2f',
  },
});
