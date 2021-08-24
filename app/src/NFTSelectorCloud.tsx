import React, { ReactChild } from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';

import { useWallet } from './WalletProvider';

export interface Props {
  selectedNFTUrl?: string;
  setSelectedNFTUrl: (_selectedNFTId?: string) => void;
  uploadImageComponent?: ReactChild;
}

export default function NFTSelectorCloud({ selectedNFTUrl, setSelectedNFTUrl, uploadImageComponent }: Props) {
  const { nfts } = useWallet();

  return (
    <View>
      <View style={styles.NFTContainerRow}>
        {nfts.map(nft => (
          <TouchableOpacity
            key={nft.id}
            style={[styles.NFTImageContainer]}
            onPress={() => setSelectedNFTUrl(nft.image_url)}
            activeOpacity={0.8}
          >
            <Image
              style={[styles.NFTImage, selectedNFTUrl === nft.image_url && styles.selectedNFTImage]}
              source={{ uri: nft.image_thumbnail_url }}
            />
          </TouchableOpacity>
        ))}
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
    paddingTop: 16,
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
    backgroundColor: 'blue',
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
