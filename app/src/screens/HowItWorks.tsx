import React from 'react';
import { StyleSheet, View } from 'react-native';

import { spacing } from '../constants';
import Typography from '../views/Typography';

export default function HowItWorks() {
  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <Typography style={styles.header} variant="header">
          How it works
        </Typography>

        <View style={styles.valuePropContainer}>
          <Typography style={styles.textIcon}>
            <span style={{ fontWeight: 600 }}>☝️</span>
          </Typography>
          <Typography style={styles.text}>Connect the wallet that owns your ENS name 🔌</Typography>
        </View>

        <View style={styles.valuePropContainer}>
          <Typography style={styles.textIcon}>
            <span style={{ fontWeight: 600 }}>✌️</span>
          </Typography>
          <Typography style={styles.text}>Select your new look (NFT or upload a photo) 🎨</Typography>
        </View>

        <View style={styles.valuePropContainer}>
          <Typography style={styles.textIcon}>
            <span style={{ fontWeight: 600 }}>🖖</span>
          </Typography>
          <Typography style={styles.text}>
            Click Save, pay the one-time gas fee, and watch your ENS profile photo update everywhere 💫
          </Typography>
        </View>

        <View style={styles.valuePropContainer}>
          <Typography style={styles.textIcon}>
            <span style={{ fontWeight: 600 }}>👋 </span>
          </Typography>
          <Typography style={styles.text}>Come back anytime! All updates are gasless! 💅</Typography>
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
    width: '100%',
    textAlign: 'center',
  },
  teamHeader: {
    fontSize: 18,
  },
  icon: {
    marginRight: 12,
  },
  textIcon: {
    marginRight: 8,
    marginLeft: 4,
    fontSize: 18,
    // paddingTop: 2,
  },
  text: {
    fontSize: 18,
    // paddingTop: 2,
  },
  valuePropContainer: {
    textAlign: 'left',
    // marginTop: 32,
    width: '100%',
    padding: 16,
    flexDirection: 'row',
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
