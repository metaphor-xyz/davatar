import React, { useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { useWalletConnect } from "@carlosdp/react-native-dapp";
import { useWallet } from "./WalletProvider";

import { httpsCallable, signInWithCustomToken } from "./firebase";

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
  const { connect } = useWallet();

  const connectWallet = useCallback(async () => {
    try {
      const wallet = await connect();

      if (!wallet) {
        throw new Error("no wallet connected");
      }

      const accounts = await wallet.eth.getAccounts();
      const address = accounts[0];
      console.log(accounts);

      const challenge = await httpsCallable("connectWallet")({ address });

      const signature = await wallet.eth.personal.sign(
        challenge.data as string,
        address,
        "password"
      );
      console.log(signature);

      const result = await httpsCallable("connectWallet")({
        address,
        signature,
      });

      signInWithCustomToken(result.data as string);

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

  return <Button title="Connect Wallet" onPress={connectWallet} />;
}
