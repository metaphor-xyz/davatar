import React from "react";
import { registerRootComponent } from "expo";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { VIEW_STEPS } from "./constants";
import WalletProvider from "./WalletProvider";
import AboutScreen from "./screens/AboutScreen";
import MoreModal from "./views/MoreModal";
import ConnectScreen from "./screens/ConnectScreen";
import SelectNFTScreen from "./screens/SelectNFTScreen";
import SelectSocialsScreen from "./screens/SelectSocialsScreen";
import TopNav from "./views/TopNav";

const Stack = createNativeStackNavigator();
export type NavScreenProps = { navigation?: any };

function App() {
  return (
    <WalletProvider>
      <Navigation />
    </WalletProvider>
  );
}

function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Group>
          <Stack.Screen
            name={VIEW_STEPS.CONNECT}
            component={ConnectScreen}
            options={{
              header: () => <TopNav />,
            }}
          />
          <Stack.Screen
            name={VIEW_STEPS.ABOUT}
            component={AboutScreen}
            options={{
              header: () => <TopNav />,
            }}
          />
          <Stack.Screen
            name={VIEW_STEPS.SELECT_NFT}
            component={SelectNFTScreen}
            options={{
              header: () => <TopNav />,
            }}
          />
          <Stack.Screen
            name={VIEW_STEPS.SELECT_SOCIAL_WEBSITES}
            component={SelectSocialsScreen}
            options={{
              header: () => <TopNav />,
            }}
          />
        </Stack.Group>
        <Stack.Group
          screenOptions={{ presentation: "modal", headerShown: false }}
        >
          <Stack.Screen name={VIEW_STEPS.MORE_MODAL} component={MoreModal} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default registerRootComponent(App);
