import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';

import { useWallet } from '../WalletProvider';
import { spacing } from '../constants';
import { snapshot } from '../firebase';
import Button from '../views/Button';
import PageContainer from '../views/PageContainer';
import Typography from '../views/Typography';

export default function SelectSocialsScreen({ navigation }) {
  const { address } = useWallet();
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  useEffect(() => {
    if (address) {
      return snapshot('avatars', address, doc => {
        // eslint-disable-next-line
        const data = doc.data() as any;
        setAvatarUri(`https://gateway.ipfs.io/${data.ipfs}`);
      });
    }
  }, [address]);

  return (
    <PageContainer>
      <Typography style={styles.spaced} variant="header">
        Select Discord, ENS, Twitter...
      </Typography>

      {avatarUri && <Image style={styles.preview} source={{ uri: avatarUri }} />}
      <View style={styles.buttonsContainer}>
        <View>
          <Button title="Back" onPress={navigation.goBack} />
        </View>
        <View></View>
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: 'row',
    width: '225px',
    maxWidth: '100%',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingTop: spacing(2),
  },
  spaced: {
    paddingTop: spacing(2),
  },
  preview: {
    flex: 1,
    width: '200px',
    height: '200px',
  },
});
