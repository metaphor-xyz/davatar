import React, { ReactChild } from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  children?: ReactChild | ReactChild[];
};

export default function PageContainer({ children }: Props) {
  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    width: "100%",
    alignItems: "center",
  },
  container: {
    width: "100%",
    maxWidth: "750px",
    alignItems: "center",
    paddingRight: "32px",
    paddingLeft: "32px",
  },
});
