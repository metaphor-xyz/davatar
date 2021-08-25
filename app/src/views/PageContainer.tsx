import React, { ReactChild } from 'react';
import { StyleSheet, View } from 'react-native';

import useIsMoWeb from '../useIsMoWeb';

type Props = {
  noMaxWidth?: boolean;
  noBottomPadding?: boolean;
  backgroundComponent?: ReactChild | ReactChild[];
} & React.PropsWithChildren<Record<string, unknown>>;

export default function PageContainer({ noMaxWidth, noBottomPadding, backgroundComponent, children }: Props) {
  const isMoWeb = useIsMoWeb();

  return (
    <View style={styles.outerContainer}>
      {backgroundComponent}
      <View
        style={[
          styles.container,
          isMoWeb && styles.containerXS,
          noMaxWidth && styles.containerNoMaxWidth,
          noBottomPadding && styles.containerNoBottomPadding,
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: '#fff',
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
    paddingBottom: 100,
  },
  containerNoMaxWidth: {
    maxWidth: 'initial',
  },
  containerNoBottomPadding: {
    paddingBottom: 0,
  },
  containerXS: {
    paddingRight: '24px',
    paddingLeft: '24px',
  },
});
