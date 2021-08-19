import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image } from "react-native";

import { spacing } from "../constants";
import Button from "../views/Button";
import { snapshot } from '../firebase';
import { useWallet } from '../WalletProvider';
import { BASE_URL } from '../helpers';
import PageContainer from "../views/PageContainer";

export default function SelectSocialsScreen({ navigation }) {
  const { address } = useWallet();
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  useEffect(() => {
    if (address) {
      return snapshot("avatars", address, (doc) => {
        const data = doc.data() as any;
        setAvatarUri(`${BASE_URL}/ipfs/ipns/${data.ipns}`);
      });
    }
  }, []);

  return (
    <PageContainer>
      <Text style={styles.headerText}>Select Discord, ENS, Twitter...</Text>

      {avatarUri && (
        <Image style={styles.preview} source={{ uri: avatarUri }} />
      )}
      <View style={styles.buttonsContainer}>
        <View>
          <Button title="Back" onPress={navigation.goBack} />
        </View>
        <View></View>
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
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
  headerText: {
    fontSize: 48,
    fontWeight: "600",
    paddingTop: spacing(2),
  },
});
