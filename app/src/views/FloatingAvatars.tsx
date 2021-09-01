import React, { useRef, useEffect, useCallback, useState, ReactElement } from 'react';
import { View, LayoutChangeEvent, StyleSheet, Animated } from 'react-native';

import { OpenSeaNFT } from '../WalletProvider';
import { docs, storageRef, getDownloadURL } from '../firebase';
import Avatar from './Avatar';

const dist = (x1: number, y1: number, x2: number, y2: number): number => {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
};

interface FloatingAvatarProps {
  x: number;
  y: number;
  r: number;
  uri: string;
}

function FloatingAvatar({ x, y, r, uri }: FloatingAvatarProps) {
  const ax = useRef(new Animated.Value(x - r)).current;
  const ay = useRef(new Animated.Value(y - r)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(Math.random() * 2000 + 100),
        Animated.timing(ay, {
          toValue: y - r + 5,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.delay(Math.random() * 2000 + 100),
        Animated.timing(ay, {
          toValue: y - r,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ); //.start();
  }, [ay, r, y]);

  return (
    <Animated.View style={{ left: ax, top: ay }}>
      <Avatar style={[styles.circle, { height: r * 2, width: r * 2, borderRadius: r * 2 }]} uri={uri} />
    </Animated.View>
  );
}

export default function FloatingAvatars() {
  const [avatars, setAvatars] = useState<ReactElement[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    docs('featured').then(featured => {
      Promise.all(featured.docs.map(d => getDownloadURL(storageRef(d.data().key)))).then(featuredUrls => {
        if (featuredUrls.length < 10) {
          fetch(
            `https://api.opensea.io/api/v1/assets?order_direction=desc&limit=${
              10 - featured.size
            }&collection=boredapeyachtclub`
          )
            .then(res => res.json())
            .then(data => {
              if (data && data.assets) {
                setImages([...featuredUrls, ...data.assets.map((n: OpenSeaNFT) => n.image_thumbnail_url)]);
              }
            });
        } else {
          setImages(featuredUrls);
        }
      });
    });
  }, []);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setDimensions({ width, height });
  }, []);

  useEffect(() => {
    if (!dimensions || images.length < 1 || avatars.length > 0) {
      return;
    }

    const circles = [];
    const numCircles = 15;
    const max = 10000;
    let counter = 0;
    const radius = 30;
    const padding = 20;
    const centerPadding = 300;
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;

    while (circles.length < numCircles && counter < max) {
      const circle = {
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        r: radius,
      };
      let overlapping = false;

      // check that it is not overlapping with any existing circle
      // another brute force approach
      for (let i = 0; i < circles.length; i++) {
        const existing = circles[i];
        const d = dist(circle.x, circle.y, existing.x, existing.y);
        const dCenter = dist(circle.x, circle.y, centerX, centerY);
        if (d < circle.r + existing.r + padding || dCenter < centerPadding) {
          // They are overlapping
          overlapping = true;
          // do not add to array
          break;
        }
      }

      // add valid circles to array
      if (!overlapping) {
        circles.push(circle);
      }

      counter++;
    }

    setAvatars(circles.map((c, i) => <FloatingAvatar key={i} x={c.x} y={c.y} r={c.r} uri={images[i]} />));
  }, [images, dimensions, avatars]);

  return (
    <View style={styles.container} onLayout={onLayout}>
      {avatars}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: '100px',
    width: '100%',
    top: '200px',
  },
  circle: {
    position: 'absolute',
    backgroundColor: '#000',
  },
});
