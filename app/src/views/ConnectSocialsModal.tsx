import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { spacing } from '../constants';
import Button from './Button';
import ConnectTwitter from './ConnectTwitter';
import CustomModal from './CustomModal';
import Typography from './Typography';

export default function ConnectSocialsModal() {
  const navigation = useNavigation();

  return (
    <CustomModal>
      <Typography style={styles.text}>Want to update your Twitter profile photo too?</Typography>

      <View style={styles.spaced}>
        <ConnectTwitter />
      </View>

      <View style={styles.doneButton}>
        <Button title="Done" onPress={navigation.goBack} />
      </View>
    </CustomModal>
  );
}

const styles = StyleSheet.create({
  spaced: {
    paddingTop: spacing(2),
  },
  doneButton: {
    alignSelf: 'flex-end',
    paddingTop: spacing(4),
  },
  text: {
    fontSize: 18,
  },
  content: { justifyContent: 'space-between' },
});
