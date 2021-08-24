import { StackScreenProps } from '@react-navigation/stack';
import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';

import CustomImagePicker from '../CustomImagePicker';
import { useWallet } from '../WalletProvider';
import { spacing, VIEW_STEPS } from '../constants';
import { httpsCallable, storageRef, uploadBytes } from '../firebase';
import Button from '../views/Button';
import PageContainer from '../views/PageContainer';
import Typography from '../views/Typography';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function SelectNFTScreen({ navigation }: StackScreenProps<Record<string, any>>) {
  const [avatar, setAvatar] = useState<Blob | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { wallet } = useWallet();

  const upload = useCallback(async () => {
    if (wallet && avatar) {
      const avatarId = await httpsCallable('createAvatar')();

      const accounts = await wallet.eth.getAccounts();
      const address = accounts[0];

      const ref = storageRef(`${address}/${avatarId.data}`);
      await uploadBytes(ref, avatar);

      await httpsCallable('storeIpfs')({ address, avatarId: avatarId.data });

      navigation.navigate(VIEW_STEPS.SELECT_SOCIAL_WEBSITES);
    }
  }, [wallet, avatar, navigation]);

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
      <Typography style={styles.spaced} variant="header">
        Select NFT
      </Typography>

      <View style={styles.content}>
        <View>{preview && <Image style={styles.preview} source={{ uri: preview }} />}</View>
        <View>
          <CustomImagePicker preview={preview} onChange={setAvatar} />
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <View style={{ flexGrow: 1, marginRight: '6px' }}>
          <Button title="Back" onPress={navigation.goBack} />
        </View>
        <View style={{ flexGrow: 1, marginLeft: '6px' }}>
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
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    width: '225px',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    alignItems: 'center',
    maxWidth: '100%',
    paddingTop: spacing(2),
  },
  spaced: {
    paddingTop: spacing(2),
  },
  previewContainer: {
    flex: 1,
    width: '200px',
    height: '200px',
  },
  preview: {
    flex: 1,
    width: '200px',
    height: '200px',
  },
  content: {
    paddingTop: spacing(2),
    flex: 1,
    justifyContent: 'center',
    minHeight: '275px',
  },
});
