import React, { useCallback } from "react";
import { View } from "react-native";
import { useWalletConnect } from "@carlosdp/react-native-dapp";
import Web3 from "web3";
import { useWallet } from "./WalletProvider";
import WalletConnectProvider from "@walletconnect/web3-provider";

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
      await connector.connect();
      const provider = new WalletConnectProvider({
        connector,
        infuraId: "e6e57d41c8b2411ea434bf96efe69f08",
      });
      console.log(provider);
      const wallet = new Web3(provider as any);

      if ((await wallet.eth.net.getNetworkType()) !== "ropsten") {
        alert("Woah! Use Ropsten Test Network for now.");
        connector.killSession();
        return;
      }

      setWallet(wallet);
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
