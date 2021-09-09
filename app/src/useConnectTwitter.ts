import { makeRedirectUri, startAsync } from 'expo-auth-session';
import { useCallback, useEffect, useState } from 'react';

import { useUser } from './UserProvider';
import { httpsCallable } from './firebase';

type LoginLogoutFunctionType = (_onComplete?: () => void) => void;

type ContextProps = {
  connected: boolean;
  login: LoginLogoutFunctionType;
  logout: LoginLogoutFunctionType;
  loading: boolean;
};

export default function useConnectTwitter(): ContextProps {
  const [connected, setConnected] = useState(false);
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.twitterConnected) {
        setConnected(false);
      } else {
        setConnected(false);
      }
    }
  }, [user]);

  const login: LoginLogoutFunctionType = useCallback(async onComplete => {
    try {
      setLoading(true);
      const request = await httpsCallable('requestTwitterToken')({
        redirectUri: makeRedirectUri({ scheme: 'davatar' }),
      });

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

      if (onComplete) {
        onComplete();
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const logout: LoginLogoutFunctionType = useCallback(async onComplete => {
    try {
      setLoading(true);

      // TODO : ADD DISCONNECT TWITTER

      if (onComplete) {
        onComplete();
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { connected, login, logout, loading };
}
