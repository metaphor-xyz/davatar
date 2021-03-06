import { ExpoConfig, ConfigContext } from '@expo/config';

// eslint-disable-next-line
export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    name: 'davatar',
    slug: 'davatar',
    description: 'One decentralized avatar for everything Web3.',
    icon: './src/assets/logo.png',
    web: {
      favicon: './src/assets/logo.png',
      name: 'davatar',
      description: 'One decentralized avatar for everything Web3.',
    },
    entryPoint: './src/App.tsx',
  };
};
