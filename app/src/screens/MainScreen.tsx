import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

import { useENS } from '../ENSProvider';
import { useWallet } from '../WalletProvider';
import { spacing } from '../constants';
import useIsMoWeb from '../useIsMoWeb';
import useUser from '../useUser';
import PageContainer from '../views/PageContainer';
import SectionContainer from '../views/SectionContainer';
import Typography from '../views/Typography';
import AboutSection from './AboutSection';
import ConnectSection from './ConnectSection';
import HowItWorks from './HowItWorks';
import SelectNFTSection from './SelectNFTSection';
import TeamSection from './TeamSection';

export default function MainScreen() {
  const isMoWeb = useIsMoWeb();
  const { wallet } = useWallet();
  const { loading, user } = useUser();
  const { loading: loadingENS } = useENS();

  if (loading || loadingENS) {
    return (
      <PageContainer>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" />
        </View>
      </PageContainer>
    );
  }

  if (wallet && user) return <SelectNFTSection />;

  return (
    <>
      <PageContainer containerNoMaxWidth noBottomPadding>
        <SectionContainer noTopPadding>
          {isMoWeb && (
            <Typography style={styles.header} variant="header" fontWeight={600}>
              davatar
            </Typography>
          )}
          <Typography style={styles.subtitle}>One avatar for everything Web3</Typography>

          <ConnectSection />
        </SectionContainer>

        <SectionContainer noBottomPadding backgroundColor="#5a58eb">
          <AboutSection />
        </SectionContainer>

        <SectionContainer noBottomPadding>
          <HowItWorks />
        </SectionContainer>

        <SectionContainer backgroundColor="#5a58eb">
          <TeamSection />
        </SectionContainer>
      </PageContainer>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    color: '#5a58eb',
    paddingBottom: spacing(2),
  },
  spaced: {
    paddingTop: spacing(2),
  },
  subtitle: {
    fontSize: 44,
  },
  loaderContainer: {
    paddingTop: spacing(5),
    width: '100%',
    alignItems: 'center',
  },
});
