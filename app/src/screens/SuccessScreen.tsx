import React from 'react';
import { StyleSheet, View, Image, Platform, Linking } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

import { spacing } from '../constants';
import useUser from '../useUser';
import BackRow from '../views/BackRow';
import Button from '../views/Button';
import PageContainer from '../views/PageContainer';
import Typography from '../views/Typography';

export default function SuccessScreen() {
  const { loading, user } = useUser();

  const onJoinDiscord = async () => {
    const url = 'https://discord.gg/DRWXxhcn58';

    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      if (await Linking.canOpenURL(url)) {
        await Linking.openURL(url);
      }
    }
  };

  if (loading)
    return (
      <PageContainer>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" />
        </View>
      </PageContainer>
    );

  return (
    <PageContainer>
      <BackRow />

      <View style={styles.container}>
        <Typography variant="header">Looking good!</Typography>

        {user?.avatarPreviewURL && <Image style={styles.avatar} source={{ uri: user.avatarPreviewURL }} />}
      </View>

      <View style={styles.container}>
        <Typography style={styles.spaced}>Want to show off your new look?</Typography>
        <View style={styles.spaced}>
          <Button title="Post to Twitter" />
        </View>
      </View>

      <View style={styles.container}>
        <Typography style={styles.spaced}>
          Want to recieve updates on new features & releases? Have feedback to share?
        </Typography>
        <View style={styles.spaced}>
          <Button title="Join our Discord" onPress={onJoinDiscord} />
        </View>
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  avatar: {
    marginTop: spacing(2),
    flex: 1,
    width: '200px',
    height: '200px',
    borderRadius: 100,
    backgroundColor: 'gray',
  },
  container: {
    paddingTop: spacing(4),
    alignItems: 'center',
    textAlign: 'center',
  },
  spaced: {
    paddingTop: spacing(2),
  },
  loaderContainer: {
    paddingTop: spacing(5),
    width: '100%',
    alignItems: 'center',
  },
});
