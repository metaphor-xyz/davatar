import React from 'react';
import { StyleSheet, View } from 'react-native';

import useIsMoWeb from '../useIsMoWeb';

type Props = {
  noTopPadding?: boolean;
  backgroundColor?: string;
} & React.PropsWithChildren<Record<string, unknown>>;

export default function SectionContainer({ children, backgroundColor, noTopPadding }: Props) {
  const isMoWeb = useIsMoWeb();

  return (
    <View
      style={[
        styles.outerContainer,
        { backgroundColor: backgroundColor || '#f8f8fe' },
        noTopPadding && { paddingTop: 0 },
      ]}
    >
      <View style={[styles.container, isMoWeb && styles.containerXS]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: '#f8f8fe',
    width: '100%',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 40,
  },
  container: {
    width: '100%',
    maxWidth: '750px',
    // alignItems: 'center',
    paddingRight: '32px',
    paddingLeft: '32px',
  },

  containerXS: {
    paddingRight: '24px',
    paddingLeft: '24px',
  },
});
