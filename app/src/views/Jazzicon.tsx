import Color from 'color';
import MersenneTwister from 'mersenne-twister';
import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Svg, Rect } from 'react-native-svg';

const colors = [
  '#01888C', // teal
  '#FC7500', // bright orange
  '#034F5D', // dark teal
  '#F73F01', // orangered
  '#FC1960', // magenta
  '#C7144C', // raspberry
  '#F3C100', // goldenrod
  '#1598F2', // lightning blue
  '#2465E1', // sail blue
  '#F19E02', // gold
];

const wobble = 30;
const shapeCount = 3;

export interface Props {
  address: string;
  size: number;
  style?: ViewStyle;
}

export default function Jazzicon({ address, size, style }: Props) {
  const [generator, setGenerator] = useState<MersenneTwister | null>(null);
  const [localColors, setLocalColors] = useState<string[]>([]);

  useEffect(() => {
    const seed = parseInt(address.slice(2, 10), 16);

    const gen = new MersenneTwister(seed);
    const amount = gen.random() * 30 - wobble / 2;

    setGenerator(gen);
    setLocalColors(colors.map(hex => new Color(hex).rotate(amount).hex()));
  }, [address]);

  const randomNumber = useCallback(() => {
    if (generator) {
      return generator.random();
    } else {
      return 0;
    }
  }, [generator]);

  const randomColor = useCallback(() => {
    return [...localColors].splice(Math.floor(localColors.length * randomNumber()), 1)[0];
  }, [randomNumber, localColors]);

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          backgroundColor: randomColor(),
          borderRadius: size / 2,
        },
        style,
      ]}
    >
      <Svg width={size} height={size}>
        {Array(shapeCount)
          .fill(0)
          .map((_, index) => {
            const center = size / 2;

            const firstRot = randomNumber();
            const angle = Math.PI * 2 * firstRot;
            const velocity = (size / shapeCount) * randomNumber() + (index * size) / shapeCount;

            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;

            const secondRot = randomNumber();
            const rot = firstRot * 360 + secondRot * 180;

            return (
              <Rect
                key={`shape_${index}`}
                x={0}
                y={0}
                width={size}
                height={size}
                fill={randomColor()}
                transform={`translate(${tx} ${ty}) rotate(${rot.toFixed(1)} ${center} ${center})`}
              />
            );
          })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});
