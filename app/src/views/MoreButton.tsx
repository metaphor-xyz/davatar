import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { spacing } from '../constants';
import CustomPaperModal from './CustomPaperModal';

export default function MoreButton() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity style={[styles.container]} onPress={() => setVisible(true)} activeOpacity={0.8}>
        <MaterialIcons name="more-horiz" size={24} color="white" />
      </TouchableOpacity>
      <CustomPaperModal visible={visible} onClose={() => setVisible(false)} title="More">
        <Text>MY CONTENT</Text>
      </CustomPaperModal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing(1),
    paddingRight: spacing(2),
    paddingLeft: spacing(2),
    backgroundColor: '#5C59EB',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
});
