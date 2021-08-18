import React from "react";
import { StyleSheet, View, Text } from "react-native";

import Button from "./Button";

import { useNavigation } from "@react-navigation/native";

export default function MoreModal() {
  const navigation = useNavigation();

  return (
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <Text>MENU</Text>
        <Button title="Close" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
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
});
