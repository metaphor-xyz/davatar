import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import { registerRootComponent } from "expo";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { onAuthStateChanged } from "./firebase";
import { spacing, VIEW_STEPS } from "./constants";
import WalletProvider, { useWallet } from "./WalletProvider";
import AboutScreen from "./screens/AboutScreen";
import ConnectScreen from "./screens/ConnectScreen";
import SelectNFTScreen from "./screens/SelectNFTScreen";
import SelectSocialsScreen from "./screens/SelectSocialsScreen";
import ScreenStepProvider, { useScreenSteps } from "./ScreenStepProvider";
import TopNav from "./views/TopNav";

const Stack = createNativeStackNavigator();
export type NavScreenProps = { navigation?: any };

function App() {
  return (
    <View style={styles.outerContainer}>
      <WalletProvider>
        <ScreenStepProvider>
          <Navigation />
        </ScreenStepProvider>
      </WalletProvider>
    </View>
  );
}

function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name={VIEW_STEPS.CONNECT}
          component={ConnectScreen}
          options={{
            header: () => <TopNav />,
          }}
        />
        <Stack.Screen name={VIEW_STEPS.ABOUT} component={AboutScreen} />
        <Stack.Screen
          name={VIEW_STEPS.SELECT_NFT}
          component={SelectNFTScreen}
        />
        <Stack.Screen
          name={VIEW_STEPS.SELECT_SOCIAL_WEBSITES}
          component={SelectSocialsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: "#fff",
    width: "100%",
    display: "flex",
    alignItems: "center",
    ...Platform.select({ native: { flex: 1 }, web: { height: "100vh" } }),
  },
  container: {
    width: "100%",
    maxWidth: "750px",
    minHeight: "450px",
    paddingRight: "32px",
    paddingLeft: "32px",
    alignItems: "center",
    // justifyContent: "center",
  },
  spaced: {
    paddingTop: spacing(2),
  },
});

export default registerRootComponent(App);
