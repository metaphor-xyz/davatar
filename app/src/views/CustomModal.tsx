import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { ReactChild, useState } from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';
import { StyleSheet, View, Pressable, Platform, TouchableOpacity } from 'react-native';

import { spacing } from '../constants';
import Typography from './Typography';

type Props = {
  title?: string;
  children: ReactChild | ReactChild[];
};

export default function CustomModal({ title, children }: Props) {
  const navigation = useNavigation();

  const [mouseEntered, setMouseEntered] = useState(false);
  const onMouseEnter = useCallback(() => {
    setMouseEntered(true);
  }, []);
  const onMouseLeave = useCallback(() => {
    setMouseEntered(false);
  }, []);

  const escFunction = useCallback(
    e => {
      if (e.keyCode === 27) {
        navigation.goBack();
      }
    },
    [navigation]
  );
  useEffect(() => {
    document.addEventListener('keydown', escFunction, false);
    return () => document.removeEventListener('keydown', escFunction, false);
  }, [escFunction]);

  return (
    <View style={styles.centeredView}>
      <Pressable
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          position: 'absolute',
        }}
        onPress={navigation.goBack}
      />

      <View style={Platform.OS === 'web' ? styles.modalView : styles.mobileModalView}>
        <View style={styles.headerContainer}>
          <Typography style={styles.title}>{title}</Typography>
          <button
            style={{ border: 'none', cursor: 'pointer', background: 'none', padding: 0 }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            <TouchableOpacity
              style={[styles.closeButton, mouseEntered && styles.closeButtonHover]}
              onPress={navigation.goBack}
              activeOpacity={0.8}
            >
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
          </button>
        </View>
        {children}
      </View>
    </View>
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
