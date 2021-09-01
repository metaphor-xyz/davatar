import React from 'react';
import { StyleSheet, View } from 'react-native';

import useIsMoWeb from '../useIsMoWeb';

type Props = {
  noTopPadding?: boolean;
  noBottomPadding?: boolean;
  backgroundColor?: string;
} & React.PropsWithChildren<Record<string, unknown>>;

export default function SectionContainer({ children, backgroundColor, noTopPadding, noBottomPadding }: Props) {
  const isMoWeb = useIsMoWeb();

  return (
    <View
      style={[
        styles.outerContainer,
        isMoWeb && styles.outerContainerXS,
        { backgroundColor: backgroundColor || '#f8f8fe' },
        noTopPadding && { paddingTop: 0 },
        noBottomPadding && { paddingBottom: 0 },
      ]}
    >
      <View style={[styles.container, isMoWeb && styles.containerXS]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 54,
    paddingBottom: 54,
  },
  outerContainerXS: {
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
