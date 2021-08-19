import React, { ReactChild } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Platform,
  TouchableOpacity,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { useCallback } from "react";
import { spacing } from "../constants";

type Props = {
  title?: string;
  children: ReactChild | ReactChild[];
};

export default function CustomModal({ title, children }: Props) {
  const navigation = useNavigation();

  const escFunction = useCallback((e) => {
    if (e.keyCode === 27) {
      navigation.goBack();
    }
  }, []);
  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
    return () => document.removeEventListener("keydown", escFunction, false);
  }, []);

  return (
    <View style={styles.centeredView}>
      <Pressable
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          position: "absolute",
        }}
        onPress={navigation.goBack}
      />

      <View
        style={
          Platform.OS === "web" ? styles.modalView : styles.mobileModalView
        }
      >
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={navigation.goBack} activeOpacity={0.8}>
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>
        {children}
      </View>
    </View>
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
  mobileModalView: {
    backgroundColor: "white",
    padding: spacing(3),
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  modalView: {
    minWidth: "275px",
    height: "275px",
    maxWidth: "100%",
    maxHeight: "100%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: spacing(3),
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
  headerContainer: {
    width: "100%",
    paddingBottom: spacing(2),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontWeight: "500",
    fontSize: 18,
  },
});
