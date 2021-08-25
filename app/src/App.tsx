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
import { View } from 'react-native';
import { ActivityIndicator, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

import ENSProvider from './ENSProvider';
import WalletProvider from './WalletProvider';
import { VIEW_STEPS } from './constants';
import AboutScreen from './screens/AboutScreen';
import ErrorScreen from './screens/ErrorScreen';
import MainScreen from './screens/MainScreen';
import SuccessScreen from './screens/SuccessScreen';
import AccountModal from './views/AccountModal';
import ConnectSocialsModal from './views/ConnectSocialsModal';
import DonateModal from './views/DonateModal';
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
        <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      </PageContainer>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <WalletProvider>
        <ENSProvider>
          <Navigation />
        </ENSProvider>
      </WalletProvider>
    </PaperProvider>
  );
}

function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          title: 'Davatar',
        }}
      >
        <Stack.Group
          screenOptions={{
            header: () => <TopNav />,
          }}
        >
          <Stack.Screen name={VIEW_STEPS.CONNECT} component={MainScreen} />
          <Stack.Screen name={VIEW_STEPS.ABOUT} component={AboutScreen} />
          <Stack.Screen name={VIEW_STEPS.ERROR} component={ErrorScreen} />
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
          <Stack.Screen name={VIEW_STEPS.DONATION_MODAL} component={DonateModal} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default registerRootComponent(App);
