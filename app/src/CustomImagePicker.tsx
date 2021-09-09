import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useState } from 'react';
import { StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

import { useWallet } from './WalletProvider';
import { spacing } from './constants';
import Typography from './views/Typography';

export interface Props {
  onChange: (_uri: Blob | null) => void;
}

export default function CustomImagePicker({ onChange }: Props) {
  const [mouseEntered, setMouseEntered] = useState(false);
  const onMouseEnter = useCallback(() => {
    setMouseEntered(true);
  }, []);
  const onMouseLeave = useCallback(() => {
    setMouseEntered(false);
  }, []);

  const { loadingNfts, nfts } = useWallet();
  const pick = useCallback(async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.3,
    });

    if (!result.cancelled) {
      const blob = await new Promise<Blob>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (_e) {
          reject(new TypeError('Local image fetch failed'));
        };
        xhr.responseType = 'blob';
        // @ts-ignore
        xhr.open('GET', result.uri, true);
        xhr.send(null);
      });

      onChange(blob);
    }
  }, [onChange]);

  return (
    <button
      style={{ border: 'none', cursor: 'pointer', background: 'none', padding: 0 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {loadingNfts && <ActivityIndicator size={24} />}
      {!loadingNfts && (
        <TouchableOpacity
          accessibilityLabel="Upload photo"
          style={[styles.container, nfts.length === 0 && styles.containerWithText, mouseEntered && styles.hover]}
          onPress={pick}
          activeOpacity={0.8}
        >
          {nfts?.length === 0 && (
            <Typography style={styles.text} fontWeight={600}>
              Upload image
            </Typography>
          )}
          <Feather name="upload" size={24} color="white" />
        </TouchableOpacity>
      )}
    </button>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 4,
    marginBottom: 16,
    marginRight: 16,
    height: '75px',
    width: '75px',
    borderRadius: 50,
    flexDirection: 'row',

    padding: spacing(1),
    paddingRight: spacing(2),
    paddingLeft: spacing(2),
    backgroundColor: '#5C59EB',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerWithText: {
    width: 'initial',
    paddingRight: spacing(3),
    paddingLeft: spacing(3),
  },
  hover: {
    opacity: 0.85,
  },
  text: {
    fontSize: 18,
    paddingRight: spacing(1),
    color: '#fff',
  },
});
