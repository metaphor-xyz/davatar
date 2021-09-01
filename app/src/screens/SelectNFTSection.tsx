import { useNavigation } from '@react-navigation/native';
import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import CustomImagePicker from '../CustomImagePicker';
import { useENS } from '../ENSProvider';
import NFTSelectorCloud from '../NFTSelectorCloud';
import { useWallet } from '../WalletProvider';
import { spacing, VIEW_STEPS } from '../constants';
import { httpsCallable, storageRef, uploadBytes } from '../firebase';
import useIsMoWeb from '../useIsMoWeb';
import useUser from '../useUser';
import Avatar from '../views/Avatar';
import ENSDisplay from '../views/ENSDisplay';
import Jazzicon from '../views/Jazzicon';
import PageContainer from '../views/PageContainer';
import SaveENS from '../views/SaveENS';
import Typography from '../views/Typography';

export default function SelectNFTSection() {
  const isMoWeb = useIsMoWeb();
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
        const data = response.data as { avatarProtocol: string; avatarId: string } | null;

        if (!connected && data) {
          await setEnsAvatar(`${data.avatarProtocol}://${data.avatarId}`);
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
      <PageContainer>
        <Typography style={[styles.subtitle, isMoWeb && styles.subtitleXS]}>Choose your new look!</Typography>

        <View style={[styles.previewContainer, styles.previewContainerXS]}>
          {!avatarPreview && address && (
            <Jazzicon
              address={address}
              size={200}
              style={isMoWeb ? styles.previewPlaceholderXS : styles.previewPlaceholder}
            />
          )}
          {avatarPreview && <Avatar style={isMoWeb ? styles.previewXS : styles.preview} uri={avatarPreview} />}

          <ENSDisplay />

          {name && (
            <View style={[styles.spaced, isMoWeb && styles.spacedXS]}>
              <Typography>Select NFT or upload image</Typography>
              <NFTSelectorCloud
                selectedIndex={nftIndex}
                onSelect={setNft}
                uploadImageComponent={<CustomImagePicker onChange={setUploadedPhotoAvatar} />}
              />
            </View>
          )}
        </View>
      </PageContainer>

      <View style={{ position: 'absolute', bottom: 0, width: '100%' }}>
        {name && <SaveENS disabled={!preview} loading={inProgress} onSave={upload} preview={preview} />}
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
    paddingTop: spacing(6),
    width: '100%',
  },
  spacedXS: {
    fontSize: 18,
    paddingTop: spacing(4),
    width: '100%',
  },
  previewContainer: {
    width: '100%',
    alignItems: 'center',
    textAlign: 'center',
    paddingTop: 54,
  },
  previewContainerXS: {
    paddingTop: 24,
  },
  preview: {
    flex: 1,
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  previewXS: {
    flex: 1,
    width: 150,
    height: 150,
    borderRadius: 100,
  },
  previewPlaceholder: {
    width: 200,
    height: 200,
  },
  previewPlaceholderXS: {
    width: 150,
    height: 150,
  },
  header: {
    color: '#5a58eb',
    paddingBottom: spacing(2),
  },
  subtitle: {
    fontSize: 44,
  },
  subtitleXS: {
    fontSize: 24,
  },
});
