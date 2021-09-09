import React from 'react';
import { useCallback } from 'react';
import { Linking, Platform } from 'react-native';

import { useENS } from '../ENSProvider';
import { useWallet } from '../WalletProvider';
import useUser from '../useUser';
import Link from './Link';

export default function ForDevelopersLink() {
  const onClickLink = useCallback(async () => {
    const url = 'https://github.com/TBDAO/davatar#readme';

    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      if (await Linking.canOpenURL(url)) {
        await Linking.openURL(url);
      }
    }
  }, []);

  const { address, loadingWallet } = useWallet();
  const { user, loading: loadingUser } = useUser();
  const { loading: loadingENS } = useENS();

  if (address && user && !loadingWallet && !loadingENS && !loadingUser) return null;

  return <Link onPress={onClickLink} title="For Developers" />;
}
