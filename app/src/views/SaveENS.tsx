import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';

import { spacing, VIEW_STEPS } from '../constants';
import useENS from '../useENS';
import useUser from '../useUser';
import Button from './Button';
import Typography from './Typography';

type Props = {
  onSave: () => void;
  disabled: boolean;
};

export default function SaveENS({ disabled, onSave }: Props) {
  // eslint-disable-next-line
  const navigation: any = useNavigation();
  const [connected, setConnected] = useState(false);
  const { user } = useUser();
  const { setAvatar, getAvatar } = useENS();

  useEffect(() => {
    // Check if the user has previously been to our site
    if (user && user.ipns) {
      getAvatar().then(url => {
        setConnected(url && url === `ipns://${user.ipns.replaceAll('ipns/', '')}`);
      });
    }
  }, [getAvatar, user]);

  const connect = useCallback(() => {
    if (user && user.ipns) {
      setAvatar(`ipns://${user.ipns.replaceAll('ipns/', '')}`);
    }
  }, [setAvatar, user]);

  const onFirstTimeConnect = useCallback(() => {
    onSave();
    connect();
    navigation.navigate(VIEW_STEPS.SUCCESS_SCREEN);
    navigation.navigate(VIEW_STEPS.SELECT_SOCIALS_MODAL);
  }, [onSave, connect, navigation]);

  const onReturnTimeConnect = useCallback(() => {
    onSave();
    navigation.navigate(VIEW_STEPS.SUCCESS_SCREEN);
  }, [onSave, navigation]);

  return (
    <View style={styles.container}>
      <Button
        disabled={disabled}
        title="Save new avatar"
        onPress={connected ? onReturnTimeConnect : onFirstTimeConnect}
      />

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
