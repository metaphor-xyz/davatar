import React from "react";
import { useNavigation } from "@react-navigation/native";

import { useWallet } from "../WalletProvider";
import { VIEW_STEPS } from "../constants";
import ConnectWallet from "../ConnectWallet";
import Button from "./Button";

export default function ConnectWalletButton() {
  const navigation: any = useNavigation();
  const { address } = useWallet();

  if (!address) return <ConnectWallet />;

  const slicedAddress = address
    .slice(0, 6)
    .concat("...")
    .concat(address.slice(address.length - 4));

  return (
    <Button
      title={slicedAddress}
      onPress={() => navigation.navigate(VIEW_STEPS.CONNECT_WALLET_MODAL)}
    />
  );
}
