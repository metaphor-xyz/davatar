import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { spacing } from "../constants";
import Button from "./Button";

type Props = {
  onBack?: () => void;
};

export default function SelectSocialsView({ onBack }: Props) {
  return (
    <>
      <Text style={styles.spaced}>Select Discord, ENS, Twitter...</Text>
      <View style={styles.buttonsContainer}>
        <View>
          <Button title="Back" onPress={onBack} />
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
});
