import React, { useCallback, useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import ConnectWallet from "../ConnectWallet";
import { spacing, VIEW_STEPS } from "../constants";
import { useScreenSteps } from "../ScreenStepProvider";
import { useWallet } from "../WalletProvider";
import { onAuthStateChanged } from "../firebase";

export default function ConnectScreen({ navigation }) {
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const { address, wallet } = useWallet();
  const { step, setStep } = useScreenSteps();

  useEffect(() => {
    return onAuthStateChanged((u) => {
      setUser(u);
      setAuthReady(true);
    });
  }, [step]);

  useEffect(() => {
    console.log("user: ", user);
    if (!!user && !!wallet && step === VIEW_STEPS.CONNECT) {
      setStep(VIEW_STEPS.SELECT_NFT);
    }
  }, [user, wallet]);

  const onConnectSuccess = useCallback(() => {
    console.log("Wallet connection success!");
    navigation.navigate(VIEW_STEPS.SELECT_NFT);
  }, []);

  const onConnectFail = useCallback(() => {
    console.log("Wallet connection failed!");
    navigation.navigate(VIEW_STEPS.ERROR);
  }, []);

  if (!authReady) return <Text style={styles.spaced}>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.spaced}>Connect your wallet</Text>
      <View style={styles.spaced}>
        <ConnectWallet
          onConnectSuccess={onConnectSuccess}
          onConnectFail={onConnectFail}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  spaced: {
    paddingTop: spacing(2),
  },
  container: {
    // width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
