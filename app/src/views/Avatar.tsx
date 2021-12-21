import Davatar, { Image as DavatarImage } from '@davatar/react';
import React from 'react';
import { ImageStyle } from 'react-native';

export interface Props {
  uri?: string | null;
  address: string;
  size: number;
  style?: ImageStyle | ImageStyle[] | null;
}

export default function Avatar({ uri, style, size, address }: Props) {
  if (uri) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <DavatarImage size={size} style={style as any} uri={uri} />;
  } else if (address) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <Davatar size={size} style={style as any} address={address} />;
  } else {
    return null;
  }
}
