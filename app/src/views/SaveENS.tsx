import { FontAwesome5 } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';

import { useENS } from '../ENSProvider';
import { spacing } from '../constants';
import useConnectTwitter from '../useConnectTwitter';
import useIsMoWeb from '../useIsMoWeb';
import BigButton from './BigButton';
import Button from './Button';
import CustomPaperModal from './CustomPaperModal';
import Link from './Link';
import Typography from './Typography';

type Props = {
  onSave: () => Promise<void>;
  disabled: boolean;
  loading?: boolean;
  preview?: string | null;
};

export default function SaveENS({ loading, disabled, onSave, preview }: Props) {
  const isMoWeb = useIsMoWeb();
  const { connected: twitterConnected, loading: twitterLoading, logout: logoutOfTwitter } = useConnectTwitter();
  const { connected, loading: loadingENS, pendingTransaction } = useENS();
  const [modalVisible, setModalVisible] = useState(false);
  const [twitterConnectedBeforehand] = useState(twitterConnected);

  const onLogout = useCallback(async () => {
    logoutOfTwitter();
  }, [logoutOfTwitter]);

  const onCloseModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const onClickSave = useCallback(async () => {
    // if ((!connected || twitterConnected) && !modalVisible) {
    //   setTwitterConnectedBeforehand(twitterConnected);
    //   setModalVisible(true);
    // } else {
    onCloseModal();
    await onSave();
    // }
  }, [onSave, onCloseModal]);

  return (
    <View style={styles.container}>
      <View style={[styles.saveButton, isMoWeb && styles.centeredSaveButton]}>
        <BigButton
          title="Save davatar"
          loading={loading || loadingENS || !!pendingTransaction}
          disabled={disabled || loading || loadingENS || !!pendingTransaction}
          onPress={onClickSave}
        />
      </View>

      {modalVisible && (
        <CustomPaperModal visible={modalVisible} onClose={onCloseModal} title="Confirm update">
          <>
            {preview && <Image style={styles.preview} source={{ uri: preview }} />}

            <View style={styles.messageContainer}>
              {connected ? (
                <Typography>Welcome back! No gas fees required for this update!</Typography>
              ) : (
                <Typography>
                  To update, you will be charged a one-time gas fee. After, all subsequent updates are free!
                </Typography>
              )}

              {twitterConnectedBeforehand && false && (
                <>
                  {twitterConnected ? (
                    <Typography style={styles.spaced}>
                      Your Twitter account is connected so we will update your Twitter profile pic too.
                    </Typography>
                  ) : (
                    <Typography style={styles.spaced}>
                      Your Twitter account is no longer connected, so we will not update your Twitter profile pic.
                    </Typography>
                  )}
                  <View style={styles.twitterButton}>
                    <Button
                      disabled={!twitterConnected}
                      title={twitterConnected ? 'Disconnect Twitter' : 'Twitter disconnected ✅'}
                      onPress={onLogout}
                      preTextComponent={
                        <FontAwesome5 style={{ marginRight: 8 }} name="twitter" size={24} color="white" />
                      }
                      loading={twitterLoading}
                    />
                  </View>
                </>
              )}
            </View>

            <View style={styles.modalButtonsContainer}>
              <Link title="Cancel" onPress={onCloseModal} />
              <Button title="Sounds good!" onPress={onClickSave} />
            </View>
          </>
        </CustomPaperModal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  saveButton: {
    alignItems: 'flex-end',
    backgroundColor: '#f8f8fe',
    width: '100%',
    paddingRight: 16,
  },
  centeredSaveButton: {
    alignItems: 'center',
    paddingRight: 0,
  },
  container: {
    paddingTop: spacing(1),
    paddingBottom: spacing(1),
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f8f8fe',
  },
  messageContainer: {
    paddingTop: 16,
    width: 300,
    maxWidth: '100%',
  },
  modalButtonsContainer: {
    paddingTop: spacing(3),
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  preview: {
    flex: 1,
    width: 150,
    height: 150,
    borderRadius: 100,
  },
  spaced: {
    paddingTop: spacing(3),
    paddingBottom: spacing(1),
  },
  twitterButton: {
    paddingBottom: spacing(1),
  },
});
