import { FontAwesome5 } from '@expo/vector-icons';
import { makeRedirectUri, startAsync } from 'expo-auth-session';
import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';

import { httpsCallable } from '../firebase';
import useUser from '../useUser';
import Button from './Button';

export default function ConnectTwitter() {
  const [connected, setConnected] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      if (user.discordConnected) {
        setConnected(false);
      } else {
        setConnected(false);
      }
    }
  }, [user]);

  const login = useCallback(async () => {
    const request = await httpsCallable('requestTwitterToken')({ redirectUri: makeRedirectUri({ scheme: 'davatar' }) });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const requestData = request.data as any;

    const authUrl = `https://api.twitter.com/oauth/authenticate?${new URLSearchParams(requestData).toString()}`;
    const response = await startAsync({ authUrl, returnUrl: makeRedirectUri({ scheme: 'davatar' }) });

    if (response.type !== 'success') {
      throw new Error('user denied authentication');
    }

    await httpsCallable('connectTwitter')({
      oauthToken: requestData.oauth_token,
      oauthTokenSecret: requestData.oauth_token_secret,
      oauthVerifier: response.params.oauth_verifier,
    });
  }, []);

  return (
    <View style={styles.container}>
      {user?.avatarPreviewURL && <Image style={styles.avatar} source={{ uri: user.avatarPreviewURL }} />}

      <Button
        disabled={connected}
        title="Connect Twitter"
        onPress={login}
        preTextComponent={<FontAwesome5 style={{ marginRight: 8 }} name="twitter" size={24} color="white" />}
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
