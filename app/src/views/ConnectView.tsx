import React, { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import ConnectWallet from "../ConnectWallet";
import { spacing } from "../constants";

type Props = {
  onSuccess?: () => void;
  onError?: () => void;
};

export default function ConnectView({ onSuccess, onError }: Props) {
  const onConnectSuccess = useCallback(() => {
    console.log("Wallet connection success!");
    if (onSuccess) onSuccess();
  }, []);

  const onConnectFail = useCallback(() => {
    console.log("Wallet connection failed!");
    if (onError) onError();
  }, []);

  return (
    <>
      <Text style={styles.spaced}>Connect your wallet</Text>
      <View style={styles.spaced}>
        <ConnectWallet
          onConnectSuccess={onConnectSuccess}
          onConnectFail={onConnectFail}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  spaced: {
    paddingTop: spacing(2),
  },
});
