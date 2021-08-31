import React, { useCallback } from 'react';
import { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';

import { useENS } from '../ENSProvider';
import { spacing } from '../constants';
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
  const { connected, loading: loadingENS, pendingTransaction } = useENS();
  const [modalVisible, setModalVisible] = useState(false);

  const onCloseModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const onClickSave = useCallback(async () => {
    if (!connected && !modalVisible) {
      setModalVisible(true);
    } else {
      await onSave();
      onCloseModal();
    }
  }, [onSave, onCloseModal, connected, modalVisible]);

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
              <Typography>
                To update, you will be charged a one-time gas fee. After, all subsequent updates are free!
              </Typography>
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
    maxWidth: 250,
  },
  modalButtonsContainer: {
    paddingTop: spacing(2),
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
});
