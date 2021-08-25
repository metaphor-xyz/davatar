import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';

import { useENS } from '../ENSProvider';
import { spacing } from '../constants';
import Button from './Button';
import Typography from './Typography';

type Props = {
  onSave: () => Promise<void>;
  disabled: boolean;
};

export default function SaveENS({ disabled, onSave }: Props) {
  const { connected } = useENS();

  const onClick = useCallback(async () => {
    await onSave();
  }, [onSave]);

  return (
    <View style={styles.container}>
      <Button disabled={disabled} title="Save new avatar" onPress={onClick} />

      {!disabled && (
        <View style={styles.spaced}>
          <Typography>
            {connected
              ? 'Welcome back! You will not be charged a gas fee!'
              : 'You will be charged a one-time gas fee. All subsequent updates are free!'}
          </Typography>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing(3),
    display: 'flex',
    alignItems: 'center',
  },
  spaced: {
    paddingTop: spacing(2),
  },
});
