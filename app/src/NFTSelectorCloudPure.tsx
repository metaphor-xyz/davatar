import { Image as DavatarImage } from '@davatar/react';
import React, { useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

import { GraphNFT } from './WalletProvider';

export interface Props {
  selectedIndex?: number | null;
  onSelect?: (_id: string, _image: string, _index: number) => void;
  nfts: GraphNFT[];
}

export default function NFTSelectorCloud({ selectedIndex, onSelect, nfts }: Props) {
  const setSelected = useCallback(
    (index: number) => {
      return async () => {
        if (onSelect) {
          const nft = nfts[index];
          onSelect(`${nft.type}:${nft.contractId}/${nft.tokenId}`, nft.uri, index);
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
            {nfts.map((nft, i) => (
              <TouchableOpacity
                key={nft.id}
                style={[styles.NFTImageContainer]}
                onPress={setSelected(i)}
                activeOpacity={0.8}
              >
                <DavatarImage
                  style={selectedIndex === i ? styles.selectedNFTImage : styles.NFTImage}
                  uri={nft.uri}
                  size={75}
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
    backgroundColor: 'rgba(90, 88, 235, 0.85)',
  },
});
