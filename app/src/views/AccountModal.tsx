import React from "react";
import { StyleSheet, Text, View } from "react-native";

import Button from "./Button";

import { useNavigation } from "@react-navigation/native";
import CustomModal from "./CustomModal";
import { useWallet } from "../WalletProvider";
import { spacing } from "../constants";
import ConnectWallet from "../ConnectWallet";

export default function AccountModal() {
  const navigation = useNavigation();
  const { address } = useWallet();

  return (
    <CustomModal title="Account">
      <View style={styles.spacing}>
        <Text>{address}</Text>
      </View>
      <View style={styles.spacing}>
        <ConnectWallet />
      </View>
      <View style={styles.spacing}>
        <Button title="Close" onPress={navigation.goBack} />
      </View>
    </CustomModal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  spacing: {
    paddingTop: spacing(1),
  },
});
