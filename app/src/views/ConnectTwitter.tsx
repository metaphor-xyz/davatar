import { FontAwesome5 } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import { View, StyleSheet, Image } from 'react-native';

import useConnectTwitter from '../useConnectTwitter';
import useUser from '../useUser';
import Button from './Button';

export interface Props {
  onComplete: () => void;
}

export default function ConnectTwitter({ onComplete }: Props) {
  const { connected, loading, login } = useConnectTwitter();
  const { user } = useUser();

  const onLogin = useCallback(async () => {
    await login(onComplete);
  }, [onComplete, login]);

  return (
    <View style={styles.container}>
      {user?.avatarPreviewURL && <Image style={styles.avatar} source={{ uri: user.avatarPreviewURL }} />}

      <Button
        disabled={connected}
        title="Connect Twitter"
        onPress={onLogin}
        preTextComponent={<FontAwesome5 style={{ marginRight: 8 }} name="twitter" size={24} color="white" />}
        loading={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    width: '400px',
    alignItems: 'center',
  },
  avatar: {
    flex: 1,
    width: 150,
    height: 150,
    borderRadius: 100,
    marginBottom: 24,
  },
});
