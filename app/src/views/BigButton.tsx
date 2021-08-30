import React, { useState } from 'react';
import { useCallback } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

import Typography from './Typography';

export interface Props {
  title?: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

// eslint-disable-next-line
type AnimationConfig = any;

// Styles & animations for this button inspired by #25 found here : https://dev.to/webdeasy/top-20-css-buttons-animations-f41
export default function BigButton({ title, onPress, disabled, loading }: Props) {
  const [mouseEntered, setMouseEntered] = useState(false);
  const onMouseEnter = useCallback(() => {
    setMouseEntered(true);
  }, []);
  const onMouseLeave = useCallback(() => {
    setMouseEntered(false);
  }, []);

  return (
    <View style={styles.outerContainer}>
      <button
        style={{ border: 'none', cursor: disabled ? 'default' : 'pointer', background: 'none', padding: 0 }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        disabled={disabled}
      >
        <TouchableOpacity
          style={[styles.container, mouseEntered && styles.hover, (disabled || loading) && styles.disabled]}
          disabled={disabled}
          onPress={onPress}
          activeOpacity={0.8}
        >
          {!loading && (
            <Typography fontWeight={600} style={{ fontSize: 22, color: '#fff' }}>
              {title}
            </Typography>
          )}
          {loading && <ActivityIndicator color="#fff" size="small" />}
        </TouchableOpacity>
      </button>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedBorder: {
    width: 320,
    height: 80,
    borderRadius: 20,
    position: 'absolute',
    borderWidth: 6,
    borderStyle: 'solid',
    borderColor: 'rgba(142, 141, 220, 1)',
  },
  container: {
    padding: '10px',
    paddingRight: '16px',
    paddingLeft: '16px',
    maxWidth: '330px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    // margin: 10,
    width: 300,
    height: 60,
    borderRadius: 20,
    backgroundColor: 'linear-gradient(90deg, rgba(91, 88, 235, 1) 0%, rgba(142, 141, 220, 1) 140%)',
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  loadingButton: {
    minWidth: 100,
  },
  hover: {
    opacity: 0.85,
  },
});
