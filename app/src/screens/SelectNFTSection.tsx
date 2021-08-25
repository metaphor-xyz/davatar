import { useNavigation } from '@react-navigation/native';
import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';

import CustomImagePicker from '../CustomImagePicker';
import NFTSelectorCloud from '../NFTSelectorCloud';
import { useWallet } from '../WalletProvider';
import { spacing, VIEW_STEPS } from '../constants';
import { httpsCallable, storageRef, uploadBytes } from '../firebase';
import useENS from '../useENS';
import useUser from '../useUser';
import ENSDisplay from '../views/ENSDisplay';
import Jazzicon from '../views/Jazzicon';
import SaveENS from '../views/SaveENS';
import Typography from '../views/Typography';

export default function SelectNFTSection() {
  const [avatar, setAvatar] = useState<Blob | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { address } = useWallet();
  const { user } = useUser();
  const { name, connected, setAvatar: setEnsAvatar, pendingTransaction } = useENS();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigation = useNavigation<Record<string, any>>();
  const [nftIndex, setNftIndex] = useState<number | null>(null);
  const [inProgress, setInProgress] = useState(false);

  const upload = useCallback(async () => {
    if (address && avatar) {
      setInProgress(true);

      try {
        const avatarId = await httpsCallable('createAvatar')();

        const ref = storageRef(`${address}/${avatarId.data}`);
        await uploadBytes(ref, avatar);

        const response = await httpsCallable('storeIpfs')({ address, avatarId: avatarId.data });
        const data = response.data as { ipns: string };

        if (!connected) {
          await setEnsAvatar(`ipns://${data.ipns}`);
        }

        navigation.navigate(VIEW_STEPS.SUCCESS_SCREEN);
        if (connected) {
          navigation.navigate(VIEW_STEPS.SELECT_SOCIALS_MODAL);
        }
      } finally {
        setInProgress(false);
      }
    }
  }, [address, avatar, connected, navigation, setEnsAvatar]);

  const setNft = useCallback((blob: Blob, index: number) => {
    setAvatar(blob);
    setNftIndex(index);
  }, []);

  useEffect(() => {
    // Set Avatar if Image is Uploaded
    if (avatar) {
      const fileReaderInstance = new FileReader();
      fileReaderInstance.readAsDataURL(avatar);
      fileReaderInstance.onload = () => {
        setPreview(fileReaderInstance.result as string);
      };
    }
  }, [avatar]);

  const avatarPreview = preview || (user && user.avatarPreviewURL);

  return (
    <>
      <View style={styles.spaced}>
        <View>
          <View style={styles.previewContainer}>
            {!avatarPreview && address && <Jazzicon address={address} size={200} style={styles.previewPlaceholder} />}
            {avatarPreview && <Image style={styles.preview} source={{ uri: avatarPreview }} />}

            <ENSDisplay />
          </View>

          {name && (
            <View style={styles.spaced}>
              <Typography style={styles.spaced}>Select NFT or upload image</Typography>
              <NFTSelectorCloud
                selectedIndex={nftIndex}
                onSelect={setNft}
                uploadImageComponent={<CustomImagePicker onChange={setAvatar} />}
              />
            </View>
          )}
        </View>

        {name && <SaveENS disabled={!preview || !!pendingTransaction || inProgress} onSave={upload} />}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  spaced: {
    fontSize: 18,
    paddingTop: spacing(3),
    width: '100%',
  },
  previewContainer: {
    width: '100%',
    alignItems: 'center',
  },
  preview: {
    flex: 1,
    width: '200px',
    height: '200px',
    borderRadius: 100,
  },
  previewPlaceholder: {
    width: '200px',
    height: '200px',
  },
});
