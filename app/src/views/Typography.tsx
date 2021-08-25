import React, { ReactChild } from 'react';
import { StyleSheet, Text as ReactNativeText, TextProps } from 'react-native';

import useIsMoWeb from '../useIsMoWeb';

type Props = {
  children?: ReactChild | ReactChild[];
  // eslint-disable-next-line
  style?: any;
  fontWeight?: 200 | 300 | 400 | 500 | 600;
  variant?: string;
} & TextProps;

export default function Typography(props: Props) {
  const isMoWeb = useIsMoWeb();

  return (
    <ReactNativeText
      {...props}
      style={[
        styles[props.fontWeight?.toString() || '400'],
        props.variant && styles[`${props.variant}${isMoWeb ? 'XS' : ''}`],
        props.style,
      ]}
    >
      {props.children}
    </ReactNativeText>
  );
}

const styles = StyleSheet.create<StyleSheet.NamedStyles<Record<string, StyleSheet>>>({
  '200': {
    fontFamily: 'Inter_200ExtraLight',
  },
  '300': {
    fontFamily: 'Inter_300Light',
  },
  '400': {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  '500': {
    fontFamily: 'Inter_500Medium',
  },
  '600': {
    fontFamily: 'Inter_600SemiBold',
  },
  header: {
    fontSize: 48,
  },
  headerXS: {
    fontSize: 40,
  },
  caption: {
    fontSize: 14,
    opacity: 0.8,
  },
  captionXS: {
    fontSize: 14,
    opacity: 0.8,
  },
});
