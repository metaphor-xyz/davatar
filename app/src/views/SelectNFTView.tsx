import React, { useState, useCallback, useEffect } from "react";
import { StyleSheet, Text, View, Image } from "react-native";

import { spacing } from "../constants";
import Button from "./Button";
import CustomImagePicker from '../CustomImagePicker';
import { useWallet } from '../WalletProvider';
import { httpsCallable, storageRef, uploadBytes } from '../firebase';

type Props = {
  onBack?: () => void;
  onNext?: () => void;
};

export default function SelectNFTView({ onBack, onNext }: Props) {
  const [avatar, setAvatar] = useState<Blob | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { wallet } = useWallet();

  const upload = useCallback(async () => {
    if (wallet) {
      const avatarId = await httpsCallable('createAvatar')();

      const accounts = await wallet.eth.getAccounts();
      const address = accounts[0];

      const ref = storageRef(`${address}/${avatarId.data}`);
      await uploadBytes(ref, avatar);

      await httpsCallable('storeIpfs')({ address, avatarId: avatarId.data });

      onNext();
    }
  }, [avatar, onNext]);

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
    <>
      <Text style={styles.spaced}>Select NFT</Text>
      <View>
        { preview && <Image style={styles.preview} source={{ uri: preview }} /> }
      </View>
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
  preview: {
    flex: 1,
    width: "200px",
    height: "200px",
  },
});
