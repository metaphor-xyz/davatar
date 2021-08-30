import { useNavigation } from '@react-navigation/native';
import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';

import CustomImagePicker from '../CustomImagePicker';
import { useENS } from '../ENSProvider';
import NFTSelectorCloud from '../NFTSelectorCloud';
import { useWallet } from '../WalletProvider';
import { spacing, VIEW_STEPS } from '../constants';
import { httpsCallable, storageRef, uploadBytes } from '../firebase';
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
  const { name, connected, setAvatar: setEnsAvatar } = useENS();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigation = useNavigation<Record<string, any>>();
  const [nftIndex, setNftIndex] = useState<number | null>(null);
  const [inProgress, setInProgress] = useState(false);

  const setUploadedPhotoAvatar = useCallback((newAvatar: Blob | null) => {
    setNftIndex(null);
    setAvatar(newAvatar);
  }, []);

  const upload = useCallback(async () => {
    if (address && avatar) {
      setInProgress(true);

      try {
        const avatarId = await httpsCallable('createAvatar')();

        const ref = storageRef(`${address}/${avatarId.data}`);
        await uploadBytes(ref, avatar);

        const response = await httpsCallable('setAvatar')({ address, avatarId: avatarId.data });
        const data = response.data as string | null;

        if (!connected && data) {
          await setEnsAvatar(data);
        }

        if (data) {
          navigation.navigate(VIEW_STEPS.SUCCESS_SCREEN);
          if (user && !user.twitterConnected) {
            navigation.navigate(VIEW_STEPS.SELECT_SOCIALS_MODAL);
          }
        }
      } finally {
        setInProgress(false);
      }
    }
  }, [address, avatar, connected, navigation, setEnsAvatar, user]);

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
        <View style={styles.previewContainer}>
          {!avatarPreview && address && <Jazzicon address={address} size={200} style={styles.previewPlaceholder} />}
          {avatarPreview && <Image style={styles.preview} source={{ uri: avatarPreview }} />}

          <ENSDisplay />

          {name && (
            <View style={styles.spaced}>
              <Typography style={styles.spaced}>Select NFT or upload image</Typography>
              <NFTSelectorCloud
                selectedIndex={nftIndex}
                onSelect={setNft}
                uploadImageComponent={<CustomImagePicker onChange={setUploadedPhotoAvatar} />}
              />
            </View>
          )}
        </View>

        {name && <SaveENS disabled={!preview} loading={inProgress} onSave={upload} />}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    fontSize: 18,
    paddingTop: spacing(4),
    width: '100%',
  },
  spaced: {
    fontSize: 18,
    paddingTop: spacing(3),
    width: '100%',
  },
  previewContainer: {
    width: '100%',
    alignItems: 'center',
    textAlign: 'center',
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
