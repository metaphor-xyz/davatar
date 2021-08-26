import React, { useRef } from 'react';
import { useCallback } from 'react';
import { TouchableOpacity, StyleSheet, Animated, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

import ExpandingRing from './ExpandingRing';
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
export default function AnimatedButton({ title, onPress, disabled, loading }: Props) {
  const opacityAnimation = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0
  const marginAnimation = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  const onMouseEnter = useCallback(() => {
    Animated.parallel([
      Animated.timing(marginAnimation, {
        toValue: 6,
        duration: 300,
      } as AnimationConfig),

      Animated.timing(opacityAnimation, {
        toValue: 1,
        duration: 300,
      } as AnimationConfig),
    ]).start();
  }, [marginAnimation, opacityAnimation]);

  const onMouseLeave = useCallback(() => {
    Animated.parallel([
      Animated.timing(marginAnimation, {
        toValue: 0,
        duration: 300,
      } as AnimationConfig),

      Animated.timing(opacityAnimation, {
        toValue: 0,
        duration: 300,
      } as AnimationConfig),
    ]).start();
  }, [marginAnimation, opacityAnimation]);

  return (
    <View style={styles.outerContainer}>
      {!disabled && <ExpandingRing />}

      <button
        style={{ border: 'none', cursor: disabled ? 'default' : 'pointer', background: 'none' }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        disabled={disabled}
      >
        <Animated.View
          style={[
            styles.animatedBorder,
            {
              marginBottom: marginAnimation,
              opacity: opacityAnimation,
            },
          ]}
        />

        <Animated.View style={{ marginBottom: marginAnimation }}>
          <TouchableOpacity
            style={[styles.container, (disabled || loading) && styles.disabled]}
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
        </Animated.View>
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
    borderRadius: 500,
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
    margin: 10,
    width: 300,
    height: 60,
    borderRadius: 500,
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
});
