import React from 'react';
import { StyleSheet } from 'react-native';

import Typography from './Typography';

export interface Props {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  // eslint-disable-next-line
  style?: any;
}

export default function Link(props: Props) {
  return (
    <Typography style={[styles.link, props.style]} onPress={props.onPress} fontWeight={600}>
      {props.title}
    </Typography>
  );
}

const styles = StyleSheet.create({
  link: {
    fontSize: 16,
    color: '#5C59EB',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
});
