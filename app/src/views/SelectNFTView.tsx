import React, { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import ConnectWallet from "../ConnectWallet";
import { spacing, VIEW_STEPS } from "../constants";
import Button from "./Button";

type Props = {
  onBack?: () => void;
  onNext?: () => void;
};

export default function SelectNFTView({ onBack, onNext }: Props) {
  return (
    <>
      <Text style={styles.spaced}>Select NFT</Text>
      <View style={styles.buttonsContainer}>
        <View>
          <Button title="Back" onPress={onBack} />
        </View>
        <View>
          <Button title="Next" onPress={onNext} />
        </View>
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
    justifyContent: "space-between",
    flexWrap: "wrap",
    alignItems: "center",
    maxWidth: "100%",
    paddingTop: spacing(2),
  },
  spaced: {
    paddingTop: spacing(2),
  },
});
