import React, { useCallback } from 'react';
import { StyleSheet, View, Platform, Linking, TouchableOpacity, Image } from 'react-native';

// @ts-ignore
import penguin1 from '../assets/penguin1.png';
// @ts-ignore
import penguin2 from '../assets/penguin2.png';
import { spacing } from '../constants';
import Link from '../views/Link';
import Typography from '../views/Typography';

export default function TeamSection() {
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

  const onClickCarlos = useCallback(async () => {
    const url = 'https://twitter.com/the_carlosdp';

    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      if (await Linking.canOpenURL(url)) {
        await Linking.openURL(url);
      }
    }
  }, []);

  const onClickGail = useCallback(async () => {
    const url = 'https://twitter.com/gaildewilson';

    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      if (await Linking.canOpenURL(url)) {
        await Linking.openURL(url);
      }
    }
  }, []);

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <Typography style={styles.teamHeader} variant="header">
          Meet the Makers
        </Typography>

        <View style={styles.teamContainer}>
          <TouchableOpacity style={styles.teamMemberAvatarContainer} onPress={onClickCarlos} activeOpacity={0.8}>
            <Image style={styles.teamMemberAvatar} source={{ uri: penguin1 }} />

            <Typography style={styles.teamMemberAvatarText} fontWeight={600}>
              carlosdp.eth
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity style={styles.teamMemberAvatarContainer} onPress={onClickGail} activeOpacity={0.8}>
            <Image style={styles.teamMemberAvatar} source={{ uri: penguin2 }} />

            <Typography style={styles.teamMemberAvatarText} fontWeight={600}>
              gail.eth
            </Typography>
          </TouchableOpacity>
        </View>

        <Typography style={styles.spaced}>
          Davatar is a product built by TBDAO (name pending...). We're a small but mighty group of product people
          passionate about decentralized communities. We have a mission to make decentralized connection fun and
          accessible for everyone.
        </Typography>

        <Typography style={styles.spaced}>
          Have ideas or feedback for davatar or future products in this space?{' '}
        </Typography>

        <View style={styles.discordLinkContainer}>
          <Link style={styles.discordLink} onPress={onJoinDiscord} title="Join our Discord" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  discordLinkContainer: {
    marginTop: 8,
    justifyContent: 'center',
  },
  discordLink: {
    color: '#fff',
  },
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
    paddingBottom: 40,
  },
  subtitle: {
    paddingTop: spacing(2),
    fontSize: 20,
  },
  spaced: {
    color: '#fff',
    paddingTop: spacing(2),
    paddingBottom: spacing(1),
    textAlign: 'left',
  },
  teamHeader: {
    color: '#fff',
  },
  icon: {
    marginRight: 12,
  },
  text: {
    // paddingTop: 2,
  },
  bold: {
    fontWeight: '600',
  },
  teamMemberAvatarContainer: {
    marginRight: 24,
    marginLeft: 24,
  },
  teamMemberAvatar: {
    height: '75px',
    width: '75px',
    borderRadius: 50,
    margin: '4px',
    backgroundColor: 'blue',
  },
  teamMemberAvatarText: {
    color: '#fff',
    paddingTop: 8,
  },
  teamContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    paddingTop: 24,
    paddingBottom: 16,
  },
});
