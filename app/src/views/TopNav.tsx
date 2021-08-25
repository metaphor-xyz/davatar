import React from 'react';
import { StyleSheet, View } from 'react-native';

import { spacing } from '../constants';
import ConnectWalletButton from './ConnectWalletButton';
import MoreButton from './MoreButton';
import PageContainer from './PageContainer';

export default function TopNav() {
  return (
    <PageContainer noMaxWidth>
      <View style={styles.topNav}>
        <View style={styles.buttonsContainers}>
          <View style={styles.rightPadding}>
            <ConnectWalletButton />
          </View>
          <MoreButton />
        </View>
      </View>
    </PageContainer>
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
    paddingTop: spacing(3),
    paddingBottom: spacing(3),
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
