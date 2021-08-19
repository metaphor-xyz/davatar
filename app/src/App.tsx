import React from "react";
import { registerRootComponent } from "expo";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";

import { VIEW_STEPS } from "./constants";
import WalletProvider from "./WalletProvider";
import AboutScreen from "./screens/AboutScreen";
import ConnectScreen from "./screens/ConnectScreen";
import SelectNFTScreen from "./screens/SelectNFTScreen";
import SelectSocialsScreen from "./screens/SelectSocialsScreen";
import MoreModal from "./views/MoreModal";
import TopNav from "./views/TopNav";
import AccountModal from "./views/AccountModal";

const Stack = createStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#5C59EB",
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
          <Stack.Screen
            name={VIEW_STEPS.SELECT_NFT}
            component={SelectNFTScreen}
          />
          <Stack.Screen
            name={VIEW_STEPS.SELECT_SOCIAL_WEBSITES}
            component={SelectSocialsScreen}
          />
        </Stack.Group>
        <Stack.Group
          screenOptions={{
            presentation: "transparentModal",
            headerShown: false,
          }}
        >
          <Stack.Screen name={VIEW_STEPS.MORE_MODAL} component={MoreModal} />
          <Stack.Screen
            name={VIEW_STEPS.CONNECT_WALLET_MODAL}
            component={AccountModal}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default registerRootComponent(App);
