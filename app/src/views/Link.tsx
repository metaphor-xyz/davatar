import React from "react";
import { Text, StyleSheet } from "react-native";

export interface Props {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
}

export default function Link(props: Props) {
  return (
    <Text style={styles.link} onPress={props.onPress}>
      {props.title}
    </Text>
  );
}

const styles = StyleSheet.create({
  link: {
    color: "#5C59EB",
    "&:hover": {
      textDecoration: "underline",
    },
  },
});
