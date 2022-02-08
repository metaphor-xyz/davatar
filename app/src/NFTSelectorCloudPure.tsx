import React, { useCallback } from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';

import { OpenSeaNFT } from './WalletProvider';

const SUPPORTED_ERCS = ['ERC721', 'ERC1155'];

export interface Props {
  selectedIndex?: number | null;
  onSelect?: (_id: string, _image: string, _index: number) => void;
  nfts: OpenSeaNFT[];
}

export default function NFTSelectorCloud({ selectedIndex, onSelect, nfts }: Props) {
  const setSelected = useCallback(
    (index: number) => {
      return async () => {
        if (onSelect) {
          const nft = nfts[index];
          onSelect(
            `${nft.asset_contract.schema_name.toLowerCase()}:${nft.asset_contract.address}/${nft.token_id}`,
            nft.image_preview_url,
            index
          );
        }
      };
    },
    [nfts, onSelect]
  );

  return (
    <View>
      <View style={styles.NFTContainerRow}>
        {nfts && (
          <>
            {nfts
              .filter(nft => SUPPORTED_ERCS.includes(nft.asset_contract.schema_name) && !nft.animation_url)
              .map((nft, i) => (
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
