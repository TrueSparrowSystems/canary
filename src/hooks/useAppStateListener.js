import {useEffect, useState} from 'react';
import {AppState} from 'react-native';

export const AppStates = {
  Active: 'active',
  InActive: 'inactive',
  Background: 'background',
};

export const useAppStateListener = () => {
  const [appState, setAppState] = useState(AppState.currentState);
  useEffect(() => {
    const handleAppStateChange = nextAppState => {
      setAppState(nextAppState);
    };
    const appStateSubscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => appStateSubscription.remove();
  });
  return {
    isAppInBackground:
      appState === AppStates.InActive || appState === AppStates.Background,
  };
};
