import React from 'react';
import { StyleSheet, View } from 'react-native';

import useIsMoWeb from '../useIsMoWeb';
import Jazzicon from './Jazzicon';

export default function MassiveJazzicon() {
  const isMoWeb = useIsMoWeb();

  return (
    <View style={[styles.jazziconContainer, isMoWeb && styles.jazziconContainerXS]}>
      <Jazzicon address="1" size={isMoWeb ? 500 : 800} />
    </View>
  );
}

const styles = StyleSheet.create({
  jazziconContainer: {
    opacity: 0.85,
    position: 'absolute',
    right: 30,
    top: 44,
    marginRight: '-225px',
  },
  jazziconContainerXS: {
    position: 'absolute',
    right: 30,
    top: 140,
  },
});
