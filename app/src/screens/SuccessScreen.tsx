import { FontAwesome5 } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Image, Platform, Linking } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

import { useENS } from '../ENSProvider';
import { spacing } from '../constants';
import { httpsCallable } from '../firebase';
import useIsMoWeb from '../useIsMoWeb';
import useUser from '../useUser';
import BackRow from '../views/BackRow';
import Button from '../views/Button';
import PageContainer from '../views/PageContainer';
import SectionContainer from '../views/SectionContainer';
import Typography from '../views/Typography';

export default function SuccessScreen() {
  const isMoWeb = useIsMoWeb();
  const { name, loading: loadingENS } = useENS();
  const { loading, user } = useUser();
  const [isFeatured, setIsFeatured] = useState(false);

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

  const onFeature = useCallback(() => {
    httpsCallable('featureAvatar')({ ethName: name });
    setIsFeatured(true);
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
      <SectionContainer noTopPadding noBottomPadding>
        <BackRow />

        <View style={styles.headerContainer}>
          <Typography style={[isMoWeb && styles.subtitleXS]} variant="header">
            Looking good!
          </Typography>

          {user?.avatarPreviewURL && (
            <Image style={[styles.avatar, styles.avatarXS]} source={{ uri: user.avatarPreviewURL }} />
          )}
        </View>

        <View style={styles.container}>
          <Typography>This update will be reflected on ENS in a few minutes!</Typography>
        </View>

        <View style={styles.container}>
          <Typography>Can we feature your davatar?</Typography>
          <View style={styles.spaced}>
            <Button
              title={`Feature my davatar ${isFeatured ? '✅' : ''}`}
              onPress={onFeature}
              disabled={isFeatured}
              preTextComponent={<FontAwesome5 style={styles.buttonIcon} name="crown" size={22} color="white" />}
            />
          </View>
        </View>

        <View style={styles.container}>
          <Typography style={styles.spaced}>Want to share about davatar?</Typography>
          <Typography>(& enter for a chance to get your gas fee refunded!)</Typography>
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
          <Typography style={styles.spaced}>Want to recieve updates on new features & releases?</Typography>
          <Typography>Have feedback to share?</Typography>
          <View style={styles.spaced}>
            <Button
              title="Join our Discord"
              onPress={onJoinDiscord}
              preTextComponent={<FontAwesome5 style={styles.buttonIcon} name="discord" size={24} color="white" />}
            />
          </View>
        </View>
      </SectionContainer>
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
  avatarXS: {
    width: '150px',
    height: '150px',
  },
  container: {
    paddingTop: spacing(4),
    alignItems: 'center',
    textAlign: 'center',
  },
  headerContainer: {
    paddingTop: spacing(1),
    alignItems: 'center',
    textAlign: 'center',
  },
  spaced: {
    paddingTop: spacing(2),
  },
  smallSpaced: {
    paddingTop: spacing(0.5),
  },
  subtitleXS: {
    fontSize: 24,
  },
  loaderContainer: {
    paddingTop: spacing(5),
    width: '100%',
    alignItems: 'center',
  },
});
