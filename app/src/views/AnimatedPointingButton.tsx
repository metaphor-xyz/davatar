import React, { useRef, useState } from 'react';
import { useCallback } from 'react';
import { TouchableOpacity, StyleSheet, Animated, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

import Typography from './Typography';

export interface Props {
  title?: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  disableAnimation?: boolean;
}

// eslint-disable-next-line
type AnimationConfig = any;

export default function AnimatedPointingButton({ title, onPress, disabled, loading, disableAnimation }: Props) {
  const expandingAnim = useRef(new Animated.Value(8)).current;
  const [mouseEntered, setMouseEntered] = useState(false);
  const onMouseEnter = useCallback(() => {
    setMouseEntered(true);
  }, []);
  const onMouseLeave = useCallback(() => {
    setMouseEntered(false);
  }, []);

  React.useEffect(() => {
    if (!disableAnimation) {
      if (!mouseEntered) {
        Animated.loop(
          Animated.sequence([
            Animated.timing(expandingAnim, {
              toValue: 24,
              duration: 1000,
              delay: mouseEntered ? 10000 : 0,
            } as AnimationConfig),
            Animated.timing(expandingAnim, {
              toValue: 8,
              duration: 500,
              delay: mouseEntered ? 10000 : 0,
            } as AnimationConfig),
          ])
        ).start();
      } else {
        Animated.timing(expandingAnim, {
          toValue: 4,
          duration: 200,
        } as AnimationConfig).start();
      }
    }
  }, [expandingAnim, mouseEntered, disableAnimation]);

  return (
    <View style={styles.outerContainer}>
      {!disableAnimation && (
        <Animated.View
          style={{
            marginRight: expandingAnim,
          }}
        >
          <Typography style={styles.hands}>👉</Typography>
        </Animated.View>
      )}

      <button
        style={{ border: 'none', cursor: disabled ? 'default' : 'pointer', background: 'none', padding: 0 }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        disabled={disabled}
      >
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
      </button>

      {!disableAnimation && (
        <Animated.View
          style={{
            marginLeft: expandingAnim,
          }}
        >
          <Typography style={styles.hands}>👈</Typography>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
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
    margin: 10,
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
  hands: {
    fontSize: 52,
  },
});
