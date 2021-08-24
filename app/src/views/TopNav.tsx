import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { spacing, VIEW_STEPS } from '../constants';
import ConnectWalletButton from './ConnectWalletButton';
import Link from './Link';
import MoreButton from './MoreButton';
import PageContainer from './PageContainer';

export default function TopNav() {
  // eslint-disable-next-line
  const navigation: any = useNavigation();
  const route = useRoute();
  const step = route.name;

  return (
    <PageContainer>
      <View style={styles.topNav}>
        <Link
          title={step === VIEW_STEPS.ABOUT || step === VIEW_STEPS.SUCCESS_SCREEN ? 'Back' : 'About'}
          onPress={
            step === VIEW_STEPS.ABOUT || step === VIEW_STEPS.SUCCESS_SCREEN
              ? navigation.goBack
              : () => navigation.navigate(VIEW_STEPS.ABOUT)
          }
        />
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
    justifyContent: 'space-between',
  },
});
