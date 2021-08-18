import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Modal, View, Text } from "react-native";

import Button from "./Button";

import dotsImageSrc from "../images/dots.png";

export default function MoreButton() {
  const [visible, setVisible] = useState(false);

  const toggleOpen = useCallback(() => {
    setVisible((lastVisible) => !lastVisible);
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
  }, []);

  console.log("visible: ", visible);

  return (
    <>
      <Button onPress={toggleOpen}>
        <img src={dotsImageSrc} />
      </Button>

      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={toggleOpen}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text>MENU</Text>
            <Button title="Close" onPress={toggleOpen} />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: "#fff",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
  },
  container: {
    width: "100%",
    maxWidth: "750px",
    minHeight: "450px",
    paddingRight: "32px",
    paddingLeft: "32px",
    alignItems: "center",
    // justifyContent: "center",
  },
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
