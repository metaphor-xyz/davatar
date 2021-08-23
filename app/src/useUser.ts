import { useState, useEffect } from 'react';

import { onAuthStateChanged, snapshot, UserInfo } from './firebase';

export interface User {
  currentAvatar?: string | null;
  ipfs?: string | null;
  ipns?: string | null;
  discordConnected?: string | null;
}

export default function useUser() {
  const [authReady, setAuthReady] = useState(false);
  const [authUser, setAuthUser] = useState<UserInfo | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    return onAuthStateChanged(u => {
      setAuthUser(u);
      setAuthReady(true);
    });
  }, []);

  useEffect(() => {
    if (authUser) {
      return snapshot('users', authUser.uid, doc => {
        const data = doc.data() as User;

        setUser(data);
      });
    }
  }, [authUser]);

  return {
    authReady,
    loggedIn: !!authUser,
    user,
  };
}
