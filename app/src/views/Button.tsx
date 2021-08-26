import React, { ReactChild } from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

import Typography from './Typography';

export interface Props {
  title?: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  size?: string;
  color?: string;
  fullWidth?: boolean;
  preTextComponent?: ReactChild | ReactChild[];
}

export default function Button({ preTextComponent, title, onPress, disabled, size, fullWidth, color, loading }: Props) {
  const [mouseEntered, setMouseEntered] = useState(false);
  const onMouseEnter = useCallback(() => {
    setMouseEntered(true);
  }, []);
  const onMouseLeave = useCallback(() => {
    setMouseEntered(false);
  }, []);

  if (loading) {
    return (
      <TouchableOpacity
        style={[
          styles.container,
          size === 'sm' && styles.containerSM,
          styles.loadingButton,
          styles.disabled,
          fullWidth && styles.fullWidth,
          color ? { backgroundColor: color } : {},
        ]}
        disabled
      >
        <ActivityIndicator color="#fff" size="small" />
      </TouchableOpacity>
    );
  }

  return (
    <button
      style={{
        border: 'none',
        cursor: disabled ? 'default' : 'pointer',
        background: 'none',
        width: fullWidth ? '100%' : undefined,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      disabled={disabled}
    >
      <TouchableOpacity
        style={[
          styles.container,
          size === 'sm' && styles.containerSM,
          mouseEntered && styles.hover,
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
    </button>
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
    opacity: 0.6,
  },
  hover: {
    opacity: 0.85,
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
  loadingButton: {
    minWidth: 100,
  },
});
