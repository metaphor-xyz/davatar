import Davatar from '@davatar/react';
import React, { CSSProperties } from 'react';
import { Image, ImageStyle } from 'react-native';

import { useWallet } from '../WalletProvider';

export interface Props {
  uri?: string | null;
  address: string;
  size: number;
  style?: ImageStyle | ImageStyle[] | null;
}

export default function Avatar({ uri, style, size, address }: Props) {
  const { wallet } = useWallet();

  if (!uri) {
    return <Davatar provider={wallet?.currentProvider} address={address} size={size} style={style as CSSProperties} />;
  }

  if (!uri.includes('data:')) {
    return (
      <Davatar
        provider={wallet?.currentProvider}
        address={address}
        size={size}
        defaultComponent={<Image style={style} source={{ uri }} />}
        style={style as CSSProperties}
      />
    );
  } else {
    return <Image style={style} source={{ uri }} />;
  }
}
