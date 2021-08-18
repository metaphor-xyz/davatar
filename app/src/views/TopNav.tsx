import React, { useState, useCallback, useEffect } from "react";
import { StyleSheet, Text, View, Image } from "react-native";

import { spacing, VIEW_STEPS } from "../constants";
import Button from "./Button";
import CustomImagePicker from "../CustomImagePicker";
import { useWallet } from "../WalletProvider";
import { httpsCallable, storageRef, uploadBytes } from "../firebase";
import Link from "./Link";
import { useScreenSteps } from "../ScreenStepProvider";
import MoreButton from "./MoreButton";

export default function TopNav() {
  const { step, wrappedSetStepFunction } = useScreenSteps();

  return (
    <>
      <View style={styles.topNav}>
        <Link
          title={step === VIEW_STEPS.ABOUT ? "Back" : "Aboutt"}
          onPress={
            step === VIEW_STEPS.ABOUT
              ? wrappedSetStepFunction(VIEW_STEPS.CONNECT)
              : wrappedSetStepFunction(VIEW_STEPS.ABOUT)
          }
        />
        <MoreButton />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  topNav: {
    paddingTop: spacing(3),
    paddingBottom: spacing(3),
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
