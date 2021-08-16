import React, { useCallback, useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { registerRootComponent } from "expo";

import { onAuthStateChanged } from './firebase';
import ConnectView from "./views/ConnectView";
import { spacing, VIEW_STEPS } from "./constants";
import AboutView from "./views/AboutView";
import WalletProvider, { useWallet } from "./WalletProvider";
import SelectNFTView from "./views/SelectNFTView";
import SelectSocialsView from "./views/SelectSocialsView";
import Link from "./views/Link";


function App() {
  return (
    <View style={styles.outerContainer}>
      <WalletProvider>
        <Navigation />
      </WalletProvider>
    </View>
  );
}

function Navigation() {
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const { wallet } = useWallet();
  const [step, setStep] = useState(VIEW_STEPS.CONNECT);

  const navigateToStep = useCallback((nextStep: string) => {
    return () => setStep(nextStep);
  }, []);

  useEffect(() => {
    return onAuthStateChanged(u => {
      setUser(u);
      setAuthReady(true);
    });
  }, [step]);

  useEffect(() => {
    if (!!user && !!wallet && step === VIEW_STEPS.CONNECT) {
      setStep(VIEW_STEPS.SELECT_NFT);
    }
  }, [user, wallet]);

  let stepComponent = undefined;
  switch (step) {
    case VIEW_STEPS.CONNECT: {
      stepComponent = (
        <ConnectView
          onSuccess={navigateToStep(VIEW_STEPS.SELECT_NFT)}
          onError={navigateToStep(VIEW_STEPS.ERROR)}
        />
      );
      break;
    }
    case VIEW_STEPS.ABOUT: {
      stepComponent = <AboutView />;
      break;
    }
    case VIEW_STEPS.SELECT_NFT: {
      stepComponent = (
        <SelectNFTView
          onBack={navigateToStep(VIEW_STEPS.CONNECT)}
          onNext={navigateToStep(VIEW_STEPS.SELECT_SOCIAL_WEBSITES)}
        />
      );
      break;
    }
    case VIEW_STEPS.SELECT_SOCIAL_WEBSITES: {
      stepComponent = (
        <SelectSocialsView onBack={navigateToStep(VIEW_STEPS.SELECT_NFT)} />
      );
      break;
    }
    case VIEW_STEPS.ERROR: {
      stepComponent = <Text style={styles.spaced}>An error occured!!!</Text>;
      break;
    }
    default: {
      stepComponent = <Text style={styles.spaced}>An error occured!!!2</Text>;
    }
  }

  if (!authReady) {
    stepComponent = <Text style={styles.spaced}>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.topNav}>
        <Link
          title={step === VIEW_STEPS.ABOUT ? "Back" : "About"}
          onPress={
            step === VIEW_STEPS.ABOUT
            ? navigateToStep(VIEW_STEPS.CONNECT)
            : navigateToStep(VIEW_STEPS.ABOUT)
          }
        />
      </View>
      <Text style={styles.spaced}>Welcome to DAOvatars!</Text>
      {stepComponent}
      <Text style={styles.spaced}>Powered by Garnet</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: "#fff",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
  topNav: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default registerRootComponent(App);
