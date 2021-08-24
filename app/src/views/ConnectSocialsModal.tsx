import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { spacing } from '../constants';
import Button from './Button';
import CustomModal from './CustomModal';
import Typography from './Typography';

export default function ConnectSocialsModal() {
  const navigation = useNavigation();
  const [twitterConnected, setTwitterConnected] = useState(false);

  const toggleTwitterConnect = useCallback(() => {
    setTwitterConnected(connection => !connection);
  }, []);

  return (
    <CustomModal title="Connect Socials">
      <Typography>Want to connect other socials?</Typography>

      <View style={styles.spaced}>
        <Button
          color="blue"
          title={twitterConnected ? 'Disonnect TWEEEETER' : 'Connect TWEEEETER'}
          onPress={toggleTwitterConnect}
        />
      </View>

      <View style={styles.spaced}>
        <Button title="Done" onPress={navigation.goBack} />
      </View>
    </CustomModal>
  );
}

const styles = StyleSheet.create({
  spaced: {
    paddingTop: spacing(2),
  },
});
