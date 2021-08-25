import { useState, useEffect } from 'react';

import { onAuthStateChanged, snapshot, UserInfo, storageRef, getDownloadURL } from './firebase';

export interface User {
  currentAvatar?: string | null;
  avatarPreviewURL?: string | null;
  ipfs?: string | null;
  ipns?: string | null;
  discordConnected?: string | null;
}

export default function useUser() {
  const [loading, setLoading] = useState(true);
  const [authUser, setAuthUser] = useState<UserInfo | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    return onAuthStateChanged(u => {
      setAuthUser(u);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (authUser) {
      return snapshot('users', authUser.uid, async doc => {
        const data = doc.data() as User;

        if (data.currentAvatar) {
          const url = await getDownloadURL(storageRef(`${authUser.uid}/${data.currentAvatar}`));
          data.avatarPreviewURL = url;
        }

        setUser(data);
      });
    }
  }, [authUser]);

  return {
    loading,
    loggedIn: !!authUser,
    user,
  };
}
