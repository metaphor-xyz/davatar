import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { useCallback } from 'react';
import { StyleSheet, View, Image, Platform, Linking } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

import { spacing } from '../constants';
import useENS from '../useENS';
import useUser from '../useUser';
import BackRow from '../views/BackRow';
import Button from '../views/Button';
import PageContainer from '../views/PageContainer';
import Typography from '../views/Typography';

export default function SuccessScreen() {
  const { name, loading: loadingENS } = useENS();
  const { loading, user } = useUser();

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

  const onClickTweet = useCallback(async () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=That was easy.%0A%0AJust updated my Web3 avatar on @davatar_xyz.%0AReady for use across the metaverse 🚀%0A%0A${name}%0Ahttps://www.davatar.xyz/`;

    if (Platform.OS === 'web') {
      window.open(twitterUrl, '_blank');
    } else {
      if (await Linking.canOpenURL(twitterUrl)) {
        await Linking.openURL(twitterUrl);
      }
    }
  }, [name]);

  if (loading || loadingENS)
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
        <Typography style={styles.spaced}>
          Want to share about davatar? (& enter to get your gas fee refunded!)
        </Typography>
        <Typography style={styles.smallSpaced} variant="caption">
          Include your ENS name to enter.
        </Typography>
        <View style={styles.spaced}>
          <Button
            title="Post to Twitter"
            onPress={onClickTweet}
            preTextComponent={<FontAwesome5 style={styles.buttonIcon} name="twitter" size={24} color="white" />}
          />
        </View>
      </View>

      <View style={styles.container}>
        <Typography style={styles.spaced}>
          Want to recieve updates on new features & releases? Have feedback to share?
        </Typography>
        <View style={styles.spaced}>
          <Button
            title="Join our Discord"
            onPress={onJoinDiscord}
            preTextComponent={<FontAwesome5 style={styles.buttonIcon} name="discord" size={24} color="white" />}
          />
        </View>
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  buttonIcon: {
    marginRight: 8,
  },
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
  smallSpaced: {
    paddingTop: spacing(0.5),
  },
  loaderContainer: {
    paddingTop: spacing(5),
    width: '100%',
    alignItems: 'center',
  },
});
