import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';

import { httpsCallable } from '../firebase';
import useUser from '../useUser';
import Button from './Button';

WebBrowser.maybeCompleteAuthSession();

export default function ConnectDiscord() {
  const [connected, setConnected] = useState(false);
  const { user } = useUser();
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: '871783976115798036',
      scopes: ['identify'],
      redirectUri: makeRedirectUri({
        scheme: 'garnet',
      }),
    },
    {
      authorizationEndpoint: 'https://discord.com/api/oauth2/authorize',
      tokenEndpoint: 'https://discord.com/api/oauth2/token',
      revocationEndpoint: 'https://discord.com/api/oauth2/token/revoke',
    }
  );

  useEffect(() => {
    if (user) {
      if (user.discordConnected) {
        setConnected(false);
      } else {
        setConnected(false);
      }
    }
  }, [user]);

  useEffect(() => {
    if (request && response && response.type === 'success') {
      const { code } = response.params;

      httpsCallable('authDiscord')({ code, verifier: request.codeVerifier });
    }
  }, [request, response]);

  const login = useCallback(() => {
    promptAsync();
  }, [promptAsync]);

  return (
    <View style={styles.container}>
      <Button disabled={!request || connected} title="Connect Discord" onPress={login} />
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
