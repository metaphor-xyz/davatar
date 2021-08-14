import React, { useState, useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import firebase from 'firebase';

import { spacing } from "../constants";
import Button from "./Button";
import CustomImagePicker from '../CustomImagePicker';
import { useWallet } from '../WalletProvider';

type Props = {
  onBack?: () => void;
  onNext?: () => void;
};

export default function SelectNFTView({ onBack, onNext }: Props) {
  const [avatar, setAvatar] = useState<Blob | null>(null);
  const wallet = useWallet();

  const upload = useCallback(async () => {
    if (wallet) {
      const avatarId = await firebase.functions().httpsCallable('createAvatar')();

      // await firebase.storage().ref().child(`${wallet}/${avatarId}`).put(avatar);

      console.log('uploaded!');

      onNext();
    }
  }, [avatar, onNext]);

  return (
    <>
      <Text style={styles.spaced}>Select NFT</Text>
      <View>
        <CustomImagePicker onChange={setAvatar} />
      </View>
      <View style={styles.buttonsContainer}>
        <View>
          <Button title="Back" onPress={onBack} />
        </View>
        <View>
          <Button title="Next" onPress={upload} />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    width: "225px",
    justifyContent: "space-between",
    flexWrap: "wrap",
    alignItems: "center",
    maxWidth: "100%",
    paddingTop: spacing(2),
  },
  spaced: {
    paddingTop: spacing(2),
  },
});
