import React, { ReactChild } from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  backgroundComponent?: ReactChild | ReactChild[];
  backgroundColor?: string;
  noBottomPadding?: boolean;
} & React.PropsWithChildren<Record<string, unknown>>;

export default function PageContainer({ backgroundComponent, children, backgroundColor, noBottomPadding }: Props) {
  return (
    <View
      style={[
        styles.outerContainer,
        noBottomPadding && { paddingBottom: 0 },
        { backgroundColor: backgroundColor || '#f8f8fe' },
      ]}
    >
      {backgroundComponent}

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    overflow: 'scroll',
    paddingTop: '74px',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    paddingBottom: 100,
  },
});
