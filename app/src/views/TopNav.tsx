import React from "react";
import { StyleSheet, View } from "react-native";

import { spacing, VIEW_STEPS } from "../constants";
import Link from "./Link";
import MoreButton from "./MoreButton";
import PageContainer from "./PageContainer";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function TopNav() {
  const navigation: any = useNavigation();
  const route = useRoute();
  const step = route.name;

  return (
    <PageContainer>
      <View style={styles.topNav}>
        <Link
          title={step === VIEW_STEPS.ABOUT ? "Back" : "About"}
          onPress={
            step === VIEW_STEPS.ABOUT
              ? () => navigation.goBack()
              : () => navigation.navigate(VIEW_STEPS.ABOUT)
          }
        />
        <MoreButton />
      </View>
    </PageContainer>
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
