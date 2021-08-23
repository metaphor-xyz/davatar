import {
  useFonts,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { registerRootComponent } from 'expo';
import React from 'react';
import { ActivityIndicator, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

import WalletProvider from './WalletProvider';
import { VIEW_STEPS } from './constants';
import AboutScreen from './screens/AboutScreen';
import ConnectScreen from './screens/ConnectScreen';
import ErrorScreen from './screens/ErrorScreen';
import SelectNFTScreen from './screens/SelectNFTScreen';
import SelectSocialsScreen from './screens/SelectSocialsScreen';
import AccountModal from './views/AccountModal';
import MoreModal from './views/MoreModal';
import PageContainer from './views/PageContainer';
import TopNav from './views/TopNav';

const Stack = createStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#5C59EB',
  },
};

function App() {
  return (
    <PaperProvider theme={theme}>
      <WalletProvider>
        <Navigation />
      </WalletProvider>
    </PaperProvider>
  );
}

function Navigation() {
  const [fontsLoaded] = useFonts({
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  if (!fontsLoaded) {
    return (
      <PageContainer>
        <ActivityIndicator size="large" />
      </PageContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Group
          screenOptions={{
            header: () => <TopNav />,
          }}
        >
          <Stack.Screen name={VIEW_STEPS.CONNECT} component={ConnectScreen} />
          <Stack.Screen name={VIEW_STEPS.ABOUT} component={AboutScreen} />
          <Stack.Screen name={VIEW_STEPS.ERROR} component={ErrorScreen} />
          <Stack.Screen name={VIEW_STEPS.SELECT_NFT} component={SelectNFTScreen} />
          <Stack.Screen name={VIEW_STEPS.SELECT_SOCIAL_WEBSITES} component={SelectSocialsScreen} />
        </Stack.Group>
        <Stack.Group
          screenOptions={{
            presentation: 'transparentModal',
            headerShown: false,
          }}
        >
          <Stack.Screen name={VIEW_STEPS.MORE_MODAL} component={MoreModal} />
          <Stack.Screen name={VIEW_STEPS.CONNECT_WALLET_MODAL} component={AccountModal} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default registerRootComponent(App);
