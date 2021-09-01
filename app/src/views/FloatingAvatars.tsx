import React, { useEffect, useCallback, useState, ReactElement } from 'react';
import { View, LayoutChangeEvent, StyleSheet } from 'react-native';

import { OpenSeaNFT } from '../WalletProvider';
import { docs, storageRef, getDownloadURL } from '../firebase';
import useIsMoWeb from '../useIsMoWeb';
import Avatar from './Avatar';
import Typography from './Typography';

const dist = (x1: number, y1: number, x2: number, y2: number): number => {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
};

interface FloatingAvatarProps {
  x: number;
  y: number;
  r: number;
  uri: string;
  name?: string;
}

function NotFloatingAvatar({ x, y, r, uri, name }: FloatingAvatarProps) {
  return (
    <View style={[styles.circleContainer, { left: x - r, top: y - r, height: r * 2 + 10 }]}>
      <Avatar
        size={r * 2}
        style={[styles.circle, { top: 0, left: 0, height: r * 2, width: r * 2, borderRadius: r * 2 }]}
        uri={uri}
      />
      {name && <Typography style={styles.circleText}>{name}</Typography>}
    </View>
  );
}

// function FloatingAvatar({ x, y, r, uri, name }: FloatingAvatarProps) {
//   const ax = useRef(new Animated.Value(x - r)).current;
//   const ay = useRef(new Animated.Value(y - r)).current;

//   useEffect(() => {
//     Animated.loop(
//       Animated.sequence([
//         Animated.delay(Math.random() * 2000 + 100),
//         Animated.timing(ay, {
//           toValue: y - r + 5,
//           duration: 2000,
//           useNativeDriver: true,
//         }),
//         Animated.delay(Math.random() * 2000 + 100),
//         Animated.timing(ay, {
//           toValue: y - r,
//           duration: 2000,
//           useNativeDriver: true,
//         }),
//       ])
//     ); //.start();
//   }, [ay, r, y]);

//   return (
//     <Animated.View style={[styles.circleContainer, { left: ax, top: ay, height: r * 2 + 10 }]}>
//       <Avatar
//         size={r * 2}
//         style={[styles.circle, { top: 0, left: 0, height: r * 2, width: r * 2, borderRadius: r * 2 }]}
//         uri={uri}
//       />
//       {name && <Typography style={styles.circleText}>{name}</Typography>}
//     </Animated.View>
//   );
// }

const NUM_AVATARS = 40;
const collections = ['boredapeyachtclub', 'meebits', 'pudgypenguins', 'myfuckingpickle'];

const getRandomAvatars = async (count: number): Promise<{ url: string }[]> => {
  const breakdown: number[] = [];
  let total = 0;
  let currentIndex = 0;

  while (total < count) {
    const portion = Math.ceil(Math.random() * (NUM_AVATARS / 2));

    breakdown[currentIndex] = portion;
    total += portion;
    currentIndex = (currentIndex + 1) % collections.length;
  }

  const avatarCollections = await Promise.all(
    collections.map((c, i) =>
      fetch(`https://api.opensea.io/api/v1/assets?order_direction=desc&limit=${breakdown[i]}&collection=${c}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.assets) {
            return data.assets.map((n: OpenSeaNFT) => ({ url: n.image_thumbnail_url }));
          } else {
            return [];
          }
        })
    )
  );

  return avatarCollections.flat();
};

export default function FloatingAvatars() {
  const isMoWeb = useIsMoWeb();
  const [avatars, setAvatars] = useState<ReactElement[]>([]);
  const [images, setImages] = useState<{ name?: string; url: string }[]>([]);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    docs('featured').then(featured => {
      Promise.all(
        featured.docs.map(d => getDownloadURL(storageRef(d.data().key)).then(url => ({ name: d.data().ethName, url })))
      ).then(feat => {
        if (feat.length < NUM_AVATARS) {
          getRandomAvatars(NUM_AVATARS - feat.length).then(collectionAvatars => {
            setImages([...feat, ...collectionAvatars]);
          });
        } else {
          setImages(feat);
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
    const numCircles = isMoWeb ? 15 : NUM_AVATARS;
    const max = 10000;
    let counter = 0;
    const radius = 30;
    const padding = 20;
    // const leftX = dimensions.width / 3 - 50;
    // const rightX = (dimensions.width / 3) * 2 + 50;
    const middleWidth = 550;
    const widthOfEachSection = (dimensions.width - middleWidth) / 2;
    const leftX = isMoWeb ? dimensions.width / 3 - 50 : widthOfEachSection - 50;
    const rightX = isMoWeb ? (dimensions.width / 3) * 2 + 50 : widthOfEachSection + middleWidth + 50;

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
        if (d < circle.r + existing.r + padding || (circle.x > leftX && circle.x < rightX)) {
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

    if (images.length >= circles.length) {
      setAvatars(
        circles.map((c, i) => (
          <NotFloatingAvatar key={i} x={c.x} y={c.y} r={c.r} uri={images[i].url} name={images[i].name} />
        ))
      );
    }
  }, [images, dimensions, avatars, isMoWeb]);

  return (
    <View style={[styles.container, isMoWeb && styles.containerXS]} onLayout={onLayout}>
      {avatars}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    top: 175,
    alignItems: 'center',
    overflowX: 'clip',
  },
  containerXS: {
    height: '100px',
    top: '220px',
  },
  circleContainer: {
    position: 'absolute',
  },
  circle: {
    backgroundColor: '#000',
  },
  circleText: {
    marginTop: 3,
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
});
