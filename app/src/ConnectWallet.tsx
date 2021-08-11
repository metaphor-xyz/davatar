import React, { useCallback } from 'react';
import { View } from 'react-native';
import { useWalletConnect } from '@carlosdp/react-native-dapp';
import Web3 from 'web3';
import { useWallet } from './WalletProvider';
import WalletConnectProvider from '@walletconnect/web3-provider';

import Button from './Button';

export default function ConnectWallet() {
  const connector = useWalletConnect();
  const { setWallet } = useWallet();

  const connect = useCallback(async () => {
    await connector.connect();
    const provider = new WalletConnectProvider({ connector, infuraId: 'e6e57d41c8b2411ea434bf96efe69f08' });
    if (provider.chainId !== 3) {
      alert('Woah! Use Ropsten Test Network for now.');
      connector.killSession();
      return;
    }
    const wallet = new Web3(provider as any);
    setWallet(wallet);
  }, [connector]);

  return (
    <View>
      <Button title='Connect Wallet' onPress={connect} />
    </View>
  );
}

