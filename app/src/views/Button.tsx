import React, { ReactChild } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export interface Props {
  title?: string;
  onPress?: () => void;
  disabled?: boolean;
  children?: ReactChild | ReactChild[];
}

export default function Button(props: Props) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={props.onPress}
      disabled={props.disabled}
      activeOpacity={0.8}
    >
      <Text style={styles.text}>
        {props.title}
        {props.children}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: "16px",
    maxWidth: "330px",
    width: "100%",
    backgroundColor: "#5C59EB",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  text: {
    color: "#fff",
    fontFamily: "Inter, sans-serif",
    fontWeight: "600",
    fontSize: 16,
  },
});
