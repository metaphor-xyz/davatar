import React from 'react';
import { View, StyleSheet, Linking, Platform } from 'react-native';

import { useENS } from '../ENSProvider';
import { spacing } from '../constants';
import Button from './Button';
import Typography from './Typography';

export default function ENSDisplay() {
  const { name } = useENS();

  const onPress = async () => {
    const url = 'https://app.ens.domains/';

    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      if (await Linking.canOpenURL(url)) {
        await Linking.openURL(url);
      }
    }
  };

  return (
    <>
      {!name && (
        <View style={styles.spaced}>
          <View style={styles.spaced}>
            <Typography>You need an ENS name to use this service.</Typography>
          </View>
          <View style={styles.spaced}>
            <Button title="Get ENS" onPress={onPress} />
          </View>
        </View>
      )}

      {name && (
        <View style={styles.spaced}>
          <Typography fontWeight={500} style={styles.text}>
            {name}
          </Typography>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  spaced: {
    paddingTop: spacing(2),
  },
  text: {
    fontSize: 20,
  },
});
