import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';

import CustomImagePicker from '../CustomImagePicker';
import NFTSelectorCloud from '../NFTSelectorCloud';
import { useWallet } from '../WalletProvider';
import { spacing } from '../constants';
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
  const { name } = useENS();

  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  useEffect(() => {
    if (user && user.avatarPreviewURL) {
      setAvatarUri(user.avatarPreviewURL);
    }
  }, [user]);

  const upload = useCallback(async () => {
    if (address && avatar) {
      const avatarId = await httpsCallable('createAvatar')();

      const ref = storageRef(`${address}/${avatarId.data}`);
      await uploadBytes(ref, avatar);

      await httpsCallable('storeIpfs')({ address, avatarId: avatarId.data });
    }
  }, [address, avatar]);

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

  const avatarPreview = preview || avatarUri;

  return (
    <>
      <View style={styles.spaced}>
        <View>
          <View style={styles.previewContainer}>
            {!preview && !avatarUri && address && (
              <Jazzicon address={address} size={200} style={styles.previewPlaceholder} />
            )}
            {avatarPreview && <Image style={styles.preview} source={{ uri: avatarPreview }} />}

            <ENSDisplay />
          </View>

          {name && (
            <View style={styles.spaced}>
              <Typography style={styles.spaced}>Select NFT or upload image</Typography>
              <NFTSelectorCloud
                selectedNFTUrl={preview}
                setSelectedNFTUrl={setPreview}
                uploadImageComponent={<CustomImagePicker onChange={setAvatar} />}
              />
            </View>
          )}
        </View>

        <SaveENS disabled={!preview} onSave={upload} />
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
