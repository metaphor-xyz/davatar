import { useCallback } from 'react';
import ENS, { getEnsAddress } from '@ensdomains/ensjs';

import { useWallet } from './WalletProvider';

export default function useSetAvatar() {
  const { wallet } = useWallet();

  const setAvatar = useCallback(async (url: string) => {
    if (wallet) {
      const provider = wallet.currentProvider as any;
      const accounts = await wallet.eth.getAccounts();
      const ens = new ENS({ provider, ensAddress: getEnsAddress(provider.chainId) });
      const ensName = await ens.getName(accounts[0]);
      console.log(ensName);
      if (ensName.name) {
        const name = ens.name(ensName.name);
        await name.setText('avatar', url);
      }
    }
  }, [wallet]);

  return setAvatar;
}

