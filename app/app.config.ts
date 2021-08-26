import { ExpoConfig, ConfigContext } from '@expo/config';

// eslint-disable-next-line
export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    name: 'davatar',
    slug: 'davatar',
    description: 'One decentralized avatar for everything Web3.',
    web: {
      favicon: './src/assets/alien-invader.png',
      name: 'davatar',
      description: 'One decentralized avatar for everything Web3.',
    },
    entryPoint: './src/App.tsx',
  };
};
