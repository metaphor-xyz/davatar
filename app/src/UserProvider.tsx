import React, { useEffect, useState, createContext, useContext } from 'react';

import { useWallet } from './WalletProvider';
import { onAuthStateChanged, snapshot, UserInfo, storageRef, getDownloadURL } from './firebase';

export interface User {
  currentAvatar?: string | null;
  avatarPreviewURL?: string | null;
  avatarProtocol?: string | null;
  avatarId?: string | null;
  discordConnected?: boolean;
  twitterConnected?: boolean;
}

export interface Context {
  user: User | null;
  loading: boolean;
  loggedIn: boolean;
}

const ProviderContext = createContext<Context>(null!);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function UserProvider({ children }: React.PropsWithChildren<Record<string, any>>) {
  const [loading, setLoading] = useState(true);
  const [authUser, setAuthUser] = useState<UserInfo | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const { wallet } = useWallet();

  useEffect(() => {
    return onAuthStateChanged(u => {
      setAuthUser(u);

      if (!u) {
        setLoading(false);
        setUser(null);
      }
    });
  }, []);

  useEffect(() => {
    if (authUser) {
      return snapshot(
        'users',
        authUser.uid,
        async doc => {
          const data = doc.data() as User;

          if (data.currentAvatar) {
            const url = await getDownloadURL(storageRef(`${authUser.uid}/${data.currentAvatar}`));
            data.avatarPreviewURL = url;
          }

          setUser(data);
          setLoading(false);
        },
        () => setLoading(false)
      );
    }
  }, [authUser]);

  return <ProviderContext.Provider value={{ loading, loggedIn: !!wallet, user }}>{children}</ProviderContext.Provider>;
}

export function useUser() {
  const context = useContext(ProviderContext);

  if (!context) {
    throw new Error('useUser must be used inside UserProvider');
  }

  return context;
}
