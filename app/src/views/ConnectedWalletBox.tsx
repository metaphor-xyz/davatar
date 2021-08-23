import React from 'react';
import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { useWallet } from '../WalletProvider';
import { sliceWalletAddress, spacing } from '../constants';
import useIsMoWeb from '../useIsMoWeb';
import Button from './Button';
import Typography from './Typography';

type Props = {
  onDisconnect?: () => void;
};

export default function ConnectedWalletBox({ onDisconnect }: Props) {
  const { address, disconnect } = useWallet();
  const isMoWeb = useIsMoWeb();

  const slicedAddress = sliceWalletAddress(address);
  const provider = '<Metamask>'; // TODO : Upadate with provider

  const handleDisconnect = useCallback(() => {
    disconnect();
    if (onDisconnect) {
      onDisconnect();
    }
  }, [disconnect, onDisconnect]);

  if (!address) return null;

  return (
    <View style={styles.innerContainer}>
      <View style={[styles.addressContainer, isMoWeb && styles.addressContainerXS]}>
        <View>
          <Typography style={styles.providerText}>Connected with {provider}</Typography>
          <Typography style={[styles.accountText]}>{slicedAddress}</Typography>
        </View>
        <View style={styles.button}>
          <Button color="#d32f2f" size="sm" title="Disconnect" onPress={handleDisconnect} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  innerContainer: {
    width: '400px',
    maxWidth: '100%',
  },
  addressContainer: {
    width: '100%',
    border: 'solid rgba(0,0,0,0.1) 2px',
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    padding: spacing(2),
    paddingTop: spacing(2),
    paddingBottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  addressContainerXS: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingBottom: spacing(1),
  },
  providerText: {
    fontSize: 12,
  },
  button: {
    paddingBottom: spacing(1),
  },
  accountText: {
    paddingTop: spacing(1),
    fontSize: 18,
    fontWeight: '500',
    paddingBottom: spacing(2),
  },
});
