import React, { useCallback } from "react";
import { View } from "react-native";
import { useWalletConnect } from "@carlosdp/react-native-dapp";
import Web3 from "web3";
import { useWallet } from "./WalletProvider";
import WalletConnectProvider from "@walletconnect/web3-provider";
import firebase from 'firebase';

import Button from "./views/Button";

type Props = {
  onConnectSuccess?: () => void;
  onConnectFail?: () => void;
};

export default function ConnectWallet({
  onConnectSuccess,
  onConnectFail,
}: Props) {
  const connector = useWalletConnect();
  const { setWallet } = useWallet();

  const connect = useCallback(async () => {
    try {
      const provider = new WalletConnectProvider({
        connector,
        infuraId: "e6e57d41c8b2411ea434bf96efe69f08",
      });
      await provider.enable();

      const wallet = new Web3(provider as any);
      const networkType = await wallet.eth.net.getNetworkType();

      if (networkType !== "ropsten") {
        alert("Woah! Use Ropsten Test Network for now.");
        connector.killSession();
        return;
      }

      setWallet(wallet);

      const accounts = await wallet.eth.getAccounts();
      const address = accounts[0];
      console.log(accounts);

      const challenge = await firebase.functions().httpsCallable('connectWallet')({ address });

      const signature = await wallet.eth.personal.sign(challenge.data, address, 'password');
      console.log(signature);

      const result = await firebase.functions().httpsCallable('connectWallet')({ address, signature });

      await firebase.auth().signInWithCustomToken(result.data);

      if (onConnectSuccess) {
        onConnectSuccess();
      }
    } catch (e) {
      console.log("Error: ", e);
      if (onConnectFail) {
        onConnectFail();
      }
    }
  }, [connector]);

  return (
    <View>
      <Button title="Connect Wallet" onPress={connect} />
    </View>
  );
}
