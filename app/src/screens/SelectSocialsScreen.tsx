import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

import { spacing } from '../constants';
import useUser from '../useUser';
import Button from '../views/Button';
import ConnectDiscord from '../views/ConnectDiscord';
import PageContainer from '../views/PageContainer';

export default function SelectSocialsScreen({ navigation }) {
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      setAvatarUri(`https://gateway.ipfs.io/${user.ipfs}`);
    }
  }, [user]);

  return (
    <PageContainer>
      <Text style={styles.headerText}>Select Discord, ENS, Twitter...</Text>

      {avatarUri && <Image style={styles.preview} source={{ uri: avatarUri }} />}
      <View style={styles.buttonsContainer}>
        <ConnectDiscord />
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
  headerText: {
    fontSize: 48,
    fontWeight: '600',
    paddingTop: spacing(2),
  },
});
