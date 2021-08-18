import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image } from "react-native";

import { spacing, VIEW_STEPS } from "../constants";
import Button from "../views/Button";
import { snapshot } from "../firebase";
import { useWallet } from "../WalletProvider";
import { useScreenSteps } from "../ScreenStepProvider";

export default function SelectSocialsScreen({ navigation }) {
  const { address } = useWallet();
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const { wrappedSetStepFunction } = useScreenSteps();

  useEffect(() => {
    if (address) {
      return snapshot("avatars", address, (doc) => {
        const data = doc.data() as any;
        setAvatarUri(`http://localhost:8082/ipns/${data.ipns}`);
      });
    }
  }, []);

  return (
    <>
      <Text style={styles.spaced}>Select Discord, ENS, Twitter...</Text>
      {avatarUri && (
        <Image style={styles.preview} source={{ uri: avatarUri }} />
      )}
      <View style={styles.buttonsContainer}>
        <View>
          <Button
            title="Back"
            onPress={() => navigation.navigate(VIEW_STEPS.SELECT_NFT)}
          />
        </View>
        <View></View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    width: "225px",
    maxWidth: "100%",
    justifyContent: "space-between",
    flexWrap: "wrap",
    alignItems: "center",
    paddingTop: spacing(2),
  },
  spaced: {
    paddingTop: spacing(2),
  },
  preview: {
    flex: 1,
    width: "200px",
    height: "200px",
  },
});
