import React, { useState } from 'react';
import { useCallback } from 'react';
import { View, StyleSheet, Linking, Platform } from 'react-native';

import { useENS } from '../ENSProvider';
import { spacing } from '../constants';
import Button from './Button';
import CustomPaperModal from './CustomPaperModal';
import Link from './Link';
import Typography from './Typography';

export default function ENSDisplay() {
  const [infoOpen, setInfoOpen] = useState(false);
  const { name } = useENS();

  const onPress = useCallback(async () => {
    const url = 'https://app.ens.domains/';

    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      if (await Linking.canOpenURL(url)) {
        await Linking.openURL(url);
      }
    }
  }, []);

  const onOpenInfo = useCallback(async () => {
    setInfoOpen(true);
  }, []);

  const onCloseInfo = useCallback(async () => {
    setInfoOpen(false);
  }, []);

  return (
    <>
      {!name && (
        <View style={styles.spaced}>
          <View style={styles.spaced}>
            <Typography>You need an ENS name to use this service.</Typography>
          </View>
          <View style={styles.ensButtonRow}>
            <Button title="Get ENS" onPress={onPress} fullWidth />
            <View style={styles.infoButton}>
              <Link title="I already own an ENS name." onPress={onOpenInfo} style={{ fontWeight: 400 }} />
            </View>
          </View>
          <CustomPaperModal title="ENS Info" visible={infoOpen} onClose={onCloseInfo}>
            <View style={styles.modalContent}>
              <Typography>To use davatar, this wallet must own an ENS name and have the reverse record set.</Typography>

              <Typography style={styles.extraSpaced}>
                Purchase an ENS name at{' '}
                <Link title={'https://app.ens.domains'} onPress={onPress} style={{ fontWeight: 500 }} />.
              </Typography>

              <Typography style={styles.extraSpaced}>
                If this wallet owns your ENS but it's still not showing up, you need to set the reverse record on ENS:
              </Typography>
              <Typography style={styles.bulletFirst}>
                1. Go to <Link title={'https://app.ens.domains'} onPress={onPress} style={{ fontWeight: 500 }} />
              </Typography>
              <Typography style={styles.bullet}>2. Click “My Account”</Typography>
              <Typography style={styles.bullet}>3. Set reverse record to your owned ENS name</Typography>
            </View>
          </CustomPaperModal>
        </View>
      )}

      {name && (
        <View style={styles.spaced}>
          <Typography fontWeight={500} style={styles.text}>
            {name}
          </Typography>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  spaced: {
    paddingTop: spacing(2),
  },
  infoButton: {
    paddingTop: spacing(1),
  },
  ensButtonRow: {
    paddingRight: 16,
    paddingLeft: 16,
    paddingTop: spacing(3),
    width: '100%',
    alignItems: 'center',
  },
  extraSpaced: {
    paddingTop: spacing(3),
  },
  bulletFirst: {
    paddingTop: spacing(2),
    paddingLeft: spacing(2),
  },
  bullet: {
    paddingTop: spacing(1),
    paddingLeft: spacing(2),
  },
  modalContent: {
    width: 400,
    maxWidth: '100%',
    textAlign: 'left',
  },
  text: {
    fontSize: 20,
  },
});
