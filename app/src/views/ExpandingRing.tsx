import React, { useRef } from 'react';
import { StyleSheet, Animated } from 'react-native';

// eslint-disable-next-line
type AnimationConfig = any;

export default function ExpandingRing() {
  const expandingAnim = useRef(new Animated.Value(30)).current; // Initial value for opacity: 0
  const opacityAnim = useRef(new Animated.Value(1)).current; // Initial value for opacity: 0

  React.useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.timing(expandingAnim, {
          toValue: 300,
          duration: 1500,
        } as AnimationConfig),

        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 1500,
        } as AnimationConfig),
      ])
    ).start();
  }, [expandingAnim, opacityAnim]);

  return (
    <Animated.View // Special animatable View
      style={[
        styles.expandingRing,
        {
          width: expandingAnim,
          height: expandingAnim,
          opacity: opacityAnim,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  expandingRing: {
    borderRadius: 500,
    borderWidth: 6,
    borderStyle: 'solid',
    // borderColor: '#00FFCB',
    borderColor: 'rgba(142, 141, 220, 1)',
    position: 'absolute',
    // zIndex: -1,;
    // transform: 'translate(-50%, -50%)',
  },
});
