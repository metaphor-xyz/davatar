import React, { createContext, useState, useContext, useCallback } from "react";
import { VIEW_STEPS } from "./constants";

export interface Context {
  step: string;
  setStep: (nextStep: string) => void;
  wrappedSetStepFunction: (nextStep: string) => () => void;
}

const ScreenStepContext = createContext<Context>(null);

export default function ScreenStepProvider(props: React.PropsWithChildren<{}>) {
  const [step, setStep] = useState(VIEW_STEPS.CONNECT);

  const wrappedSetStepFunction = useCallback((nextStep: string) => {
    return () => setStep(nextStep);
  }, []);

  return (
    <ScreenStepContext.Provider
      value={{ step, setStep, wrappedSetStepFunction }}
    >
      {props.children}
    </ScreenStepContext.Provider>
  );
}

export function useScreenSteps() {
  const context = useContext(ScreenStepContext);

  if (!context) {
    throw new Error("useWallet must be used inside WalletContext");
  }

  return context;
}
