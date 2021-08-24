import React, { ReactChild } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

import Typography from './Typography';

export interface Props {
  title?: string;
  onPress?: () => void;
  disabled?: boolean;
  size?: string;
  color?: string;
  fullWidth?: boolean;
  preTextComponent?: ReactChild | ReactChild[];
}

export default function Button({ preTextComponent, title, onPress, disabled, size, fullWidth, color }: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        size === 'sm' && styles.containerSM,
        disabled && styles.disabled,
        fullWidth && styles.fullWidth,
        color ? { backgroundColor: color } : {},
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      {preTextComponent}
      <Typography style={[styles.text, size === 'sm' && styles.textSM]}>{title}</Typography>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: '10px',
    paddingRight: '16px',
    paddingLeft: '16px',
    maxWidth: '330px',
    backgroundColor: '#5C59EB',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    flexDirection: 'row',
  },
  containerSM: {
    height: '34px',
    borderRadius: 14,
  },
  disabled: {
    opacity: 0.8,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  textSM: {
    fontSize: 13,
  },
});
