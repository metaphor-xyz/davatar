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
import * as WebBrowser from 'expo-web-browser';
import React, { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { ActivityIndicator, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

import ENSProvider from './ENSProvider';
import UserProvider from './UserProvider';
import WalletProvider from './WalletProvider';
import { VIEW_STEPS } from './constants';
import AboutScreen from './screens/AboutScreen';
import MainScreen from './screens/MainScreen';
import SuccessScreen from './screens/SuccessScreen';
import AccountModal from './views/AccountModal';
import ConnectSocialsModal from './views/ConnectSocialsModal';
import PageContainer from './views/PageContainer';
import TopNav from './views/TopNav';

WebBrowser.maybeCompleteAuthSession();

const Stack = createStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#5C59EB',
  },
};

function App() {
  const [fontsLoaded] = useFonts({
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.has('authUrl')) {
      // @ts-ignore
      window.location = params.get('authUrl');
    }
  }, []);

  if (!fontsLoaded) {
    return (
      <PageContainer>
        <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      </PageContainer>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <WalletProvider>
        <UserProvider>
          <ENSProvider>
            <Navigation />
          </ENSProvider>
        </UserProvider>
      </WalletProvider>
    </PaperProvider>
  );
}

function Navigation() {
  const headerFunc = useCallback(() => {
    return <TopNav />;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          title: 'davatar',
        }}
      >
        <Stack.Group
          screenOptions={{
            header: headerFunc,
          }}
        >
          <Stack.Screen name={VIEW_STEPS.CONNECT} component={MainScreen} />
          <Stack.Screen name={VIEW_STEPS.ABOUT} component={AboutScreen} />
          <Stack.Screen name={VIEW_STEPS.SUCCESS_SCREEN} component={SuccessScreen} />
        </Stack.Group>
        <Stack.Group
          screenOptions={{
            presentation: 'transparentModal',
            headerShown: false,
          }}
        >
          <Stack.Screen name={VIEW_STEPS.SELECT_SOCIALS_MODAL} component={ConnectSocialsModal} />
          <Stack.Screen name={VIEW_STEPS.CONNECT_WALLET_MODAL} component={AccountModal} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default registerRootComponent(App);
