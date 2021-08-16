import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image } from "react-native";

import { spacing } from "../constants";
import Button from "./Button";
import { snapshot } from '../firebase';
import { useWallet } from '../WalletProvider';

type Props = {
  onBack?: () => void;
};

export default function SelectSocialsView({ onBack }: Props) {
  const { address } = useWallet();
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  useEffect(() => {
    if (address) {
      return snapshot('avatars', address, doc => {
        const data = doc.data() as any;
        setAvatarUri(`https://ipfs.io/ipns/${data.ipns}`);
      });
    }
  }, []);

  return (
    <>
      <Text style={styles.spaced}>Select Discord, ENS, Twitter...</Text>
      {avatarUri && <Image style={styles.preview} source={{ uri: avatarUri }} />}
      <View style={styles.buttonsContainer}>
        <View>
          <Button title="Back" onPress={onBack} />
        </View>
        <View></View>
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
    maxWidth: "100%",
    justifyContent: "space-between",
    flexWrap: "wrap",
    alignItems: "center",
    paddingTop: spacing(2),
  },
  spaced: {
    paddingTop: spacing(2),
  },
  preview: {
    flex: 1,
    width: "200px",
    height: "200px",
  },
});
