import React from 'react';
import { StyleSheet, View } from 'react-native';

import useIsMoWeb from '../useIsMoWeb';

type Props = {
  noMaxWidth?: boolean;
} & React.PropsWithChildren<Record<string, unknown>>;

export default function PageContainer({ noMaxWidth, children }: Props) {
  const isMoWeb = useIsMoWeb();

  return (
    <View style={styles.outerContainer}>
      <View style={[styles.container, isMoWeb && styles.containerXS, noMaxWidth && styles.containerNoMaxWidth]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: '#e8e8ff',
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    height: '100%',
    maxWidth: '750px',
    alignItems: 'center',
    paddingRight: '32px',
    paddingLeft: '32px',
  },
  containerNoMaxWidth: {
    maxWidth: 'initial',
  },
  containerXS: {
    paddingRight: '24px',
    paddingLeft: '24px',
  },
});
