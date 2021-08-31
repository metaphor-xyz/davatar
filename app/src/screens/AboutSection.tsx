import { Fontisto, AntDesign } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { spacing } from '../constants';
import Typography from '../views/Typography';

export default function AboutSection() {
  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <Typography style={styles.header} variant="header">
          Why use davatar?
        </Typography>

        <View style={styles.valuePropContainer}>
          <Fontisto style={[styles.icon, { fontWeight: '600' }]} name="world-o" size={24} color="white" />
          <Typography style={styles.text}>
            <span style={{ fontWeight: 600 }}>Decentralized & Global.</span> One decentralized avatar for everything
            Web3. For any site hooked up to ENS, your profile photo will already be there.
          </Typography>
        </View>

        <View style={styles.valuePropContainer}>
          <AntDesign style={styles.icon} name="star" size={24} color="white" />
          <Typography style={styles.text}>
            <span style={{ fontWeight: 600 }}>Simplified.</span> Update your profile once and watch it magically update
            everywhere.
          </Typography>
        </View>

        <View style={styles.valuePropContainer}>
          <Fontisto style={styles.icon} name="dollar" size={24} color="white" />
          <Typography style={styles.text}>
            <span style={{ fontWeight: 600 }}>One-time gas fee, unlimited updates.</span> ENS requires a gas fee for
            each update to your profile photo. Davatar solves this with IPFS. Pay once then all subsequent updates are
            gasless. Update your NiFTy look as many times as you’d like.
          </Typography>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    alignItems: 'center',
  },
  container: {
    width: 550,
    maxWidth: '100%',
    flex: 1,
    alignItems: 'center',
    textAlign: 'center',
    // backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
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
  header: {
    paddingBottom: spacing(1),
    color: '#fff',
  },
  teamHeader: {
    fontSize: 18,
  },
  icon: {
    marginRight: 12,
  },
  text: {
    // paddingTop: 2,]
    color: '#fff',
  },
  valuePropContainer: {
    padding: 16,
    textAlign: 'left',
    marginTop: 8,
    flexDirection: 'row',
    borderRadius: 20,
  },
  meetTeamContainer: {
    padding: 16,
    // textAlign: 'left',
    marginTop: spacing(4),
    borderRadius: 20,
  },
  bold: {
    fontWeight: '600',
  },
});
