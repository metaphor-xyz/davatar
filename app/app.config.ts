import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    name: 'DAOvatar',
    slug: 'daovatar',
    entryPoint: './src/App.tsx',
  };
};
