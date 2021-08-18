import React, { useCallback, useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import ConnectWallet from "../ConnectWallet";
import { spacing, VIEW_STEPS } from "../constants";
import { useWallet } from "../WalletProvider";
import { onAuthStateChanged } from "../firebase";
import PageContainer from "../views/PageContainer";
import { useRoute } from "@react-navigation/native";

export default function ConnectScreen({ navigation }) {
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const { wallet } = useWallet();
  const route = useRoute();

  useEffect(() => {
    return onAuthStateChanged((u) => {
      setUser(u);
      setAuthReady(true);
    });
  }, [route.name]);

  useEffect(() => {
    console.log("user: ", user);
    if (!!user && !!wallet && route.name === VIEW_STEPS.CONNECT) {
      navigation.navigate(VIEW_STEPS.SELECT_NFT);
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
    <PageContainer>
      <Text style={styles.spaced}>Connect your wallet</Text>
      <View style={styles.spaced}>
        <ConnectWallet
          onConnectSuccess={onConnectSuccess}
          onConnectFail={onConnectFail}
        />
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  spaced: {
    paddingTop: spacing(2),
  },
});
