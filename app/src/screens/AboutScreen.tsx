import { Fontisto, AntDesign } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import { StyleSheet, View, Platform, Linking } from 'react-native';

import { spacing } from '../constants';
import useIsMoWeb from '../useIsMoWeb';
import BackRow from '../views/BackRow';
import Jazzicon from '../views/Jazzicon';
import Link from '../views/Link';
import PageContainer from '../views/PageContainer';
import Typography from '../views/Typography';

export default function AboutScreen() {
  const isMoWeb = useIsMoWeb();

  const onJoinDiscord = useCallback(async () => {
    const url = 'https://discord.gg/DRWXxhcn58';

    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      if (await Linking.canOpenURL(url)) {
        await Linking.openURL(url);
      }
    }
  }, []);

  return (
    <>
      <PageContainer
        backgroundComponent={
          <View style={[styles.jazziconContainer, isMoWeb && styles.jazziconContainerXS]}>
            <Jazzicon address="" size={isMoWeb ? 500 : 800} />
          </View>
        }
      >
        <BackRow />

        <View style={styles.container}>
          <Typography style={styles.spaced} variant="header">
            What's davatar?
          </Typography>

          <View style={styles.valuePropContainer}>
            <Fontisto style={[styles.icon, { fontWeight: '600' }]} name="world-o" size={24} color="black" />
            <Typography style={styles.text}>
              <span style={{ fontWeight: 600 }}>Decentralized & Global.</span> One decentralized avatar for everything
              Web3. For any site hooked up to ENS, your profile photo will already be there.
            </Typography>
          </View>

          <View style={styles.valuePropContainer}>
            <AntDesign style={styles.icon} name="star" size={24} color="black" />
            <Typography style={styles.text}>
              <span style={{ fontWeight: 600 }}>Simplified.</span> Update your profile once and watch it magically
              update everywhere.
            </Typography>
          </View>

          <View style={styles.valuePropContainer}>
            <Fontisto style={styles.icon} name="dollar" size={24} color="black" />
            <Typography style={styles.text}>
              <span style={{ fontWeight: 600 }}>One-time gas fee, unlimited updates.</span> ENS requires a gas fee for
              each update to your profile photo. Davatar solves this with IPFS. Pay once then all subsequent updates are
              gasless. Update your NiFTy look as many times as you’d like.
            </Typography>
          </View>

          <View style={styles.meetTeamContainer}>
            <Typography style={styles.teamHeader} fontWeight={600}>
              Meet the Team
            </Typography>

            <Typography style={styles.spaced}>
              This is a product built by TBDAO (name pending...). We're a small but mighty group of product people
              passionate about decentralized communities. We have a mission to make decentralized connection fun and
              accessible for everyone.
            </Typography>

            <Typography style={styles.spaced}>
              Have ideas or feedback for davatar or future products in this space?{' '}
              <Link onPress={onJoinDiscord} title="Join our Discord" />
            </Typography>
          </View>
        </View>
      </PageContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 550,
    maxWidth: '100%',
    flex: 1,
    alignItems: 'center',
    textAlign: 'center',
  },
  subtitle: {
    paddingTop: spacing(2),
    fontSize: 20,
  },
  jazziconContainer: {
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
  spaced: {
    paddingTop: spacing(2),
    paddingBottom: spacing(1),
  },
  teamHeader: {
    fontSize: 18,
  },
  icon: {
    marginRight: 12,
  },
  text: {
    // paddingTop: 2,
  },
  valuePropContainer: {
    padding: 16,
    textAlign: 'left',
    marginTop: 8,
    flexDirection: 'row',
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    // backgroundColor: '#e8e8ff',
  },
  meetTeamContainer: {
    padding: 16,
    // textAlign: 'left',
    marginTop: spacing(4),
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    // backgroundColor: '#e8e8ff',
  },
});
