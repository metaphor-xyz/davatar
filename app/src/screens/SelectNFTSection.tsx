import { useNavigation } from '@react-navigation/native';
import React, { useState, useCallback } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useENS } from '../ENSProvider';
import NFTSelectorCloudPure from '../NFTSelectorCloudPure';
import { useWallet } from '../WalletProvider';
import { spacing, VIEW_STEPS } from '../constants';
import useIsMoWeb from '../useIsMoWeb';
import useUser from '../useUser';
import Avatar from '../views/Avatar';
import ENSDisplay from '../views/ENSDisplay';
import PageContainer from '../views/PageContainer';
import SaveENS from '../views/SaveENS';
import Typography from '../views/Typography';

export default function SelectNFTSection() {
  const isMoWeb = useIsMoWeb();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { address, loadingNfts, nfts, openseaError } = useWallet();
  const { user } = useUser();
  const { name, setAvatar: setEnsAvatar } = useENS();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigation = useNavigation<Record<string, any>>();
  const [nftIndex, setNftIndex] = useState<number | null>(null);
  const [inProgress, setInProgress] = useState(false);

  const upload = useCallback(async () => {
    if (address && avatar) {
      setInProgress(true);

      try {
        const success = await setEnsAvatar(avatar);

        if (success) {
          navigation.navigate(VIEW_STEPS.SUCCESS_SCREEN);
          // if (user && !user.twitterConnected) {
          //   navigation.navigate(VIEW_STEPS.SELECT_SOCIALS_MODAL);
          // }
        }
      } finally {
        setInProgress(false);
      }
    }
  }, [address, avatar, navigation, setEnsAvatar]);

  const setNft = useCallback((id: string, image: string, index: number) => {
    setAvatar(id);
    setPreview(image);
    setNftIndex(index);
  }, []);

  const avatarPreview = preview || (user && user.avatarPreviewURL);

  return (
    <>
      <PageContainer>
        <Typography style={[styles.subtitle, isMoWeb && styles.subtitleXS]}>Choose your new look!</Typography>

        <View style={[styles.previewContainer, isMoWeb && styles.previewContainerXS]}>
          {address && (
            <Avatar
              address={address}
              size={isMoWeb ? 150 : 200}
              style={isMoWeb ? styles.previewXS : styles.preview}
              uri={avatarPreview}
            />
          )}

          <ENSDisplay />

          <View style={[styles.spaced, isMoWeb && styles.spacedXS]}>
            {loadingNfts && <ActivityIndicator size={24} />}
            {openseaError && <Typography>Unable to search wallet for NFTs. Please try again later.</Typography>}
            {!openseaError && !loadingNfts && (
              <>
                {nfts.length > 0 ? (
                  <>
                    <Typography>Select NFT or upload image</Typography>
                    <NFTSelectorCloudPure selectedIndex={nftIndex} onSelect={setNft} nfts={nfts} />
                  </>
                ) : (
                  <Typography>No available NFTs found in your wallet.</Typography>
                )}
                )
              </>
            )}
          </View>
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
    borderRadius: 200,
  },
  previewXS: {
    flex: 1,
    width: 150,
    height: 150,
    borderRadius: 150,
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
