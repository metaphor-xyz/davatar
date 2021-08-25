import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { spacing } from '../constants';
import Link from './Link';

export default function BackRow() {
  // eslint-disable-next-line
  const navigation: any = useNavigation();

  return (
    <View style={styles.topNav}>
      <Ionicons style={{ fontWeight: '600', marginRight: '4px' }} name="chevron-back" size={24} color="#5C59EB" />
      <Link title="Back" onPress={navigation.goBack} />
    </View>
  );
}

const styles = StyleSheet.create({
  rightPadding: {
    paddingRight: spacing(1),
  },
  buttonsContainers: {
    flexDirection: 'row',
  },
  topNav: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
  },
});
