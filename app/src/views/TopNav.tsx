import React from 'react';
import { StyleSheet, View } from 'react-native';

import { spacing } from '../constants';
import useIsMoWeb from '../useIsMoWeb';
import ConnectWalletButton from './ConnectWalletButton';
import MoreButton from './MoreButton';
import PageContainer from './PageContainer';
import Typography from './Typography';

export default function TopNav() {
  const isMoWeb = useIsMoWeb();

  return (
    <PageContainer noMaxWidth noBottomPadding>
      <View style={styles.topNav}>
        <View>
          {!isMoWeb && (
            <>
              <Typography fontWeight={600} style={styles.header}>
                davatar
              </Typography>
              <Typography>One avatar for everything Web3.</Typography>
            </>
          )}
        </View>

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
  header: {
    fontSize: 18,
    paddingBottom: 4,
  },
  topNav: {
    paddingTop: spacing(3),
    paddingBottom: spacing(3),
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
