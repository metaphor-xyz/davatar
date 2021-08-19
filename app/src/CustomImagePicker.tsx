import React, { useCallback } from "react";
import { View, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Button from "./views/Button";
import { IconButton } from "react-native-paper";

export interface Props {
  onChange: (uri: Blob) => void;
  preview?: string | null;
}

export default function CustomImagePicker({ preview, onChange }) {
  const pick = useCallback(async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
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
    <>
      {preview && (
        <View
          style={{
            paddingTop: "8px",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <IconButton
            size={32}
            icon="delete-forever"
            onPress={() => onChange(null)}
            accessibilityLabel="Delete photo"
            color="#d32f2f"
          />
          <IconButton
            size={32}
            icon="square-edit-outline"
            onPress={pick}
            accessibilityLabel="Change photo"
            color="#5C59EB"
          />
        </View>
      )}
      {!preview && <Button title="Choose photo" onPress={pick} />}
    </>
  );
}
