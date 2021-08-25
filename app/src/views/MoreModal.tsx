import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Platform, View, Linking, Pressable } from 'react-native';
import { List } from 'react-native-paper';
import { Portal } from 'react-native-paper';

import { spacing, VIEW_STEPS } from '../constants';
import Typography from './Typography';

type Props = {
  onClose: () => void;
};

export default function MoreModal({ onClose }: Props) {
  // eslint-disable-next-line
  const navigation: any = useNavigation();

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

  return (
    <>
      <Portal>
        <Pressable
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            zIndex: 1,
          }}
          onPress={onClose}
        />

        <View style={styles.modalView}>
          <List.Section style={{ width: '100%', margin: 0 }}>
            <List.Item
              style={styles.listItem}
              title={<Typography style={styles.listItemText}>About</Typography>}
              left={() => <List.Icon icon="information" />}
              onPress={() => {
                onClose();
                navigation.navigate(VIEW_STEPS.ABOUT);
              }}
            />
            <List.Item
              style={styles.listItem}
              title={<Typography style={styles.listItemText}>Join Discord</Typography>}
              left={() => <List.Icon color="#000" icon="discord" />}
              onPress={onJoinDiscord}
            />
            <List.Item
              style={styles.listItem}
              title={<Typography style={styles.listItemText}>Donate</Typography>}
              left={() => <List.Icon color="#000" icon="handshake" />}
              onPress={() => {
                onClose();
                navigation.navigate(VIEW_STEPS.DONATION_MODAL);
              }}
            />
          </List.Section>
        </View>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  listItem: {
    padding: 0,
    paddingRight: 0,
    paddingLeft: 0,
  },
  listItemText: {
    fontSize: 18,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  modalView: {
    zIndex: 2,
    width: '250px',
    // height: '150px',
    maxWidth: '100%',
    maxHeight: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    top: 72,
    right: 32,
    position: 'absolute',
  },
  headerContainer: {
    width: '100%',
    paddingBottom: spacing(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: '500',
    fontSize: 18,
  },
});
