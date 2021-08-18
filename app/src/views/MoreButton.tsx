import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

// @ts-ignore
import dotsImageSrc from "../images/dots.png";
import { useNavigation } from "@react-navigation/native";
import { spacing, VIEW_STEPS } from "../constants";

export default function MoreButton() {
  const navigation: any = useNavigation();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate(VIEW_STEPS.MORE_MODAL)}
      activeOpacity={0.8}
    >
      <img src={dotsImageSrc} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing(1),
    paddingRight: spacing(2),
    paddingLeft: spacing(2),
    backgroundColor: "#5C59EB",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
});
