import React, { useState, useCallback, useEffect } from "react";
import { StyleSheet, Text, View, Image } from "react-native";

import { spacing, VIEW_STEPS } from "../constants";
import Button from "../views/Button";
import CustomImagePicker from "../CustomImagePicker";
import { useWallet } from "../WalletProvider";
import { httpsCallable, storageRef, uploadBytes } from "../firebase";
import PageContainer from "../views/PageContainer";

export default function SelectNFTScreen({ navigation }) {
  const [avatar, setAvatar] = useState<Blob | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { wallet } = useWallet();

  const upload = useCallback(async () => {
    if (wallet) {
      const avatarId = await httpsCallable("createAvatar")();

      const accounts = await wallet.eth.getAccounts();
      const address = accounts[0];

      const ref = storageRef(`${address}/${avatarId.data}`);
      await uploadBytes(ref, avatar);

      await httpsCallable("storeIpfs")({ address, avatarId: avatarId.data });

      navigation.navigate(VIEW_STEPS.SELECT_SOCIAL_WEBSITES);
    }
  }, [avatar]);

  useEffect(() => {
    if (avatar) {
      const fileReaderInstance = new FileReader();
      fileReaderInstance.readAsDataURL(avatar);
      fileReaderInstance.onload = () => {
        setPreview(fileReaderInstance.result as string);
      };
    }
  }, [avatar]);

  return (
    <PageContainer>
      <Text style={styles.headerText}>Select NFT</Text>
      <View style={styles.content}>
        <View>
          {preview && (
            <Image style={styles.preview} source={{ uri: preview }} />
          )}
        </View>
        <View>
          <CustomImagePicker preview={preview} onChange={setAvatar} />
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <View>
          <Button title="Back" onPress={navigation.goBack} />
        </View>
        <View>
          <Button disabled={!preview} title="Next" onPress={upload} />
        </View>
      </View>
    </PageContainer>
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
  headerText: {
    fontSize: 48,
    fontWeight: "600",
    paddingTop: spacing(2),
  },
  previewContainer: {
    flex: 1,
    width: "200px",
    height: "200px",
  },
  preview: {
    flex: 1,
    width: "200px",
    height: "200px",
  },
  content: {
    paddingTop: spacing(2),
    flex: 1,
    justifyContent: "center",
    minHeight: "275px",
  },
});
