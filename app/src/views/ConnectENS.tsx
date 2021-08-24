import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';

import useENS from '../useENS';
import useUser from '../useUser';
import Button from './Button';

export default function ConnectENS() {
  const [connected, setConnected] = useState(false);
  const { user } = useUser();
  const { setAvatar, getAvatar } = useENS();

  useEffect(() => {
    if (user && user.ipns) {
      const ipns = user.ipns;
      getAvatar().then(url => {
        setConnected(url && url === `ipns://${ipns.replaceAll('ipns/', '')}`);
      });
    }
  }, [getAvatar, user]);

  const connect = useCallback(() => {
    if (user && user.ipns) {
      setAvatar(`ipns://${user.ipns.replaceAll('ipns/', '')}`);
    }
  }, [setAvatar, user]);

  return (
    <View style={styles.container}>
      <Button disabled={connected} title="Connect ENS" onPress={connect} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    width: '400px',
    alignItems: 'center',
  },
});
