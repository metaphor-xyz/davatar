import ENS, { getEnsAddress } from '@ensdomains/ensjs';
import { useCallback, useEffect, useState } from 'react';

import { useWallet } from './WalletProvider';

export default function useENS() {
  const { wallet, address } = useWallet();
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const provider = wallet.currentProvider as any;
    const ens = new ENS({ provider, ensAddress: getEnsAddress(provider.chainId) });
    ens.getName(address).then((ensName: { name: string } | null) => setName(ensName?.name));
  }, [wallet, address]);

  const setAvatar = useCallback(
    async (url: string) => {
      if (wallet && name) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const provider = wallet.currentProvider as any;
        const ens = new ENS({ provider, ensAddress: getEnsAddress(provider.chainId) });
        const n = ens.name(name);
        await n.setText('avatar', url);
      }
    },
    [wallet, name]
  );

  const getAvatar = useCallback(async () => {
    if (wallet && name) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const provider = wallet.currentProvider as any;
      const ens = new ENS({ provider, ensAddress: getEnsAddress(provider.chainId) });
      const n = ens.name(name);
      return await n.getText('avatar');
    }
  }, [wallet, name]);

  return { name, setAvatar, getAvatar };
}
