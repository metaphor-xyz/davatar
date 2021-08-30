import { AntDesign } from '@expo/vector-icons';
import React, { ReactChild, useState } from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';
import { StyleSheet, View, Platform, TouchableOpacity } from 'react-native';
import { Modal, Portal } from 'react-native-paper';

import { spacing } from '../constants';
import Typography from './Typography';

type Props = {
  visible: boolean;
  onClose?: () => void;
  title?: string;
  children: ReactChild | ReactChild[];
};

export default function CustomPaperModal({ onClose, visible, title, children }: Props) {
  const [mouseEntered, setMouseEntered] = useState(false);
  const onMouseEnter = useCallback(() => {
    setMouseEntered(true);
  }, []);
  const onMouseLeave = useCallback(() => {
    setMouseEntered(false);
  }, []);

  const escFunction = useCallback(
    e => {
      if (e.keyCode === 27 && onClose) {
        onClose();
      }
    },
    [onClose]
  );
  useEffect(() => {
    document.addEventListener('keydown', escFunction, false);
    return () => document.removeEventListener('keydown', escFunction, false);
  }, [escFunction]);

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.modalOuterContainerStyles}>
        <View style={Platform.OS === 'web' ? styles.modalView : styles.mobileModalView}>
          <View style={styles.headerContainer}>
            <Typography style={styles.title}>{title}</Typography>
            {onClose && (
              <button
                style={{ border: 'none', cursor: 'pointer', background: 'none', padding: 0 }}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
              >
                <TouchableOpacity
                  style={[styles.closeButton, mouseEntered && styles.closeButtonHover]}
                  onPress={onClose}
                  activeOpacity={0.8}
                >
                  <AntDesign name="close" size={24} color="black" />
                </TouchableOpacity>
              </button>
            )}
          </View>
          {children}
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    borderRadius: 500,
    padding: 4,
  },
  closeButtonHover: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalOuterContainerStyles: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: 'initial',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  mobileModalView: {
    backgroundColor: 'white',
    padding: spacing(3),
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  modalView: {
    minWidth: '275px',
    // minHeight: '275px',
    maxWidth: '100%',
    maxHeight: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: spacing(3),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
