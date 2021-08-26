import { MaterialIcons } from '@expo/vector-icons';
import '@react-navigation/native';
import React from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { spacing } from '../constants';
import MoreModal from './MoreModal';

export default function MoreButton() {
  const [visible, setVisible] = useState(false);
  const [mouseEntered, setMouseEntered] = useState(false);
  const onMouseEnter = useCallback(() => {
    setMouseEntered(true);
  }, []);
  const onMouseLeave = useCallback(() => {
    setMouseEntered(false);
  }, []);

  const onClose = useCallback(() => {
    setVisible(false);
  }, []);

  const onToggleOpen = useCallback(() => {
    setVisible(prevVisible => !prevVisible);
  }, []);

  return (
    <>
      <button
        style={{ border: 'none', cursor: 'pointer', background: 'none' }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <TouchableOpacity
          style={[styles.container, mouseEntered && styles.hover]}
          onPress={onToggleOpen}
          activeOpacity={0.8}
        >
          <MaterialIcons name="more-horiz" size={24} color="white" />
        </TouchableOpacity>
      </button>

      {visible && <MoreModal onClose={onClose} />}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '56px',
    padding: spacing(1),
    paddingRight: spacing(2),
    paddingLeft: spacing(2),
    backgroundColor: '#5C59EB',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  hover: {
    opacity: 0.85,
  },
});
