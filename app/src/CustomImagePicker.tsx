import React, { useCallback } from 'react';
import { View, Button, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export interface Props {
  onChange: (uri: Blob) => void;
}

export default function CustomImagePicker({ onChange }) {
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
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.log(e);
          reject(new TypeError("Local image fetch failed"));
        };
        xhr.responseType = "blob";
        // @ts-ignore
        xhr.open("GET", result.uri, true);
        xhr.send(null);
      });

      onChange(blob);
    }
  }, []);

  return (
    <View>
      <Button
        title="Pick"
        onPress={pick}
      />
    </View>
  );
}

