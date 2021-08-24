import { StackScreenProps } from '@react-navigation/stack';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';

import { spacing } from '../constants';
import useUser from '../useUser';
import Button from '../views/Button';
import ConnectENS from '../views/ConnectENS';
import PageContainer from '../views/PageContainer';
import Typography from '../views/Typography';

export default function SelectSocialsScreen({ navigation }: StackScreenProps<Record<string, never>>) {
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const { user } = useUser();

  useEffect(() => {
    if (user && user.avatarPreviewURL) {
      setAvatarUri(user.avatarPreviewURL);
    }
  }, [user]);

  return (
    <PageContainer>
      <Typography style={styles.spaced} variant="header">
        Select Discord, ENS, Twitter...
      </Typography>

      {avatarUri && <Image style={styles.preview} source={{ uri: avatarUri }} />}
      <View style={styles.buttonsContainer}>
        <ConnectENS />
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
