import React, { ReactChild, useCallback } from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';

import { useWallet } from './WalletProvider';

export interface Props {
  selectedIndex?: number | null;
  onSelect?: (_blob: Blob, _index: number) => void;
  uploadImageComponent?: ReactChild;
}

export default function NFTSelectorCloud({ selectedIndex, onSelect, uploadImageComponent }: Props) {
  const { loadingNfts, nfts } = useWallet();

  const setSelected = useCallback(
    (index: number) => {
      return async () => {
        if (onSelect) {
          const nft = nfts[index];
          const blob = await fetch(nft.image_url).then(r => r.blob());
          onSelect(blob, index);
        }
      };
    },
    [nfts, onSelect]
  );

  return (
    <View>
      <View style={styles.NFTContainerRow}>
        {!loadingNfts && nfts && (
          <>
            {nfts.map((nft, i) => (
              <TouchableOpacity
                key={nft.id}
                style={[styles.NFTImageContainer]}
                onPress={setSelected(i)}
                activeOpacity={0.8}
              >
                <Image
                  style={[styles.NFTImage, selectedIndex === i && styles.selectedNFTImage]}
                  source={{ uri: nft.image_thumbnail_url }}
                />
              </TouchableOpacity>
            ))}
          </>
        )}
        {uploadImageComponent}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  NFTContainerRow: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  NFTImageContainer: {
    marginBottom: 16,
    marginRight: 16,
  },
  NFTImage: {
    height: '75px',
    width: '75px',
    borderRadius: 50,
    margin: '4px',
    backgroundColor: 'rgba(90, 88, 235, 0.85)',
  },
  selectedNFTImage: {
    height: '83px',
    width: '83px',
    margin: 0,
    borderColor: '#5c59eb',
    borderStyle: 'solid',
    borderWidth: 4,
  },
});
