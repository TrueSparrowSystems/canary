import React, {useCallback, useEffect, useRef, useState} from 'react';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import ScreenName from '../constants/ScreenName';
import Navigation from '../Navigation';
import PreferenceScreen from '../screens/PreferenceScreen';
import BootService from '../services/BootService';
import Cache from '../services/Cache';
import {CacheKey} from '../services/Cache/CacheStoreConstants';
import {EventTypes, LocalEvent} from '../utils/LocalEvent';
import SplashScreen from 'react-native-splash-screen';
import LandingScreen from '../screens/LandingScreen';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {handleDynamicUrl} from '../services/DynamicLinkingHelper';
import AsyncStorage from '../services/AsyncStorage';
import {StoreKeys} from '../services/AsyncStorage/StoreConstants';
import RestoreScreen from '../screens/RestoreScreen';
import InAppPdfViewerScreen from '../screens/InAppPdfViewerScreen';

const AppStack = createSharedElementStackNavigator();
const OnBoardingStack = createSharedElementStackNavigator();
function RootNavigation() {
  const [isAppLoaded, setAppLoaded] = useState(false);
  const [currentStack, setCurrentStack] = useState();

  let isHandleUrlCalled = useRef(false);
  const _handleDynamicUrl = useCallback(url => {
    LocalEvent.emit(EventTypes.CommonLoader.Hide);
    if (url) {
      if (!isHandleUrlCalled.current) {
        isHandleUrlCalled.current = true;
        // Handle dynamic linking
        handleDynamicUrl(url.url);
        setTimeout(() => {
          //Added a 5 sec timeout to avoid flickering on multiple call
          isHandleUrlCalled.current = false;
        }, 5000);
      }
    }
  }, []);

  const handleDynamicLinkingOnBoot = useCallback(() => {
    AsyncStorage.get(StoreKeys.IsAppReloaded).then(isAppReloaded => {
      if (isAppReloaded) {
        AsyncStorage.remove(StoreKeys.IsAppReloaded);
      } else {
        LocalEvent.emit(EventTypes.CommonLoader.Show);
        dynamicLinks().getInitialLink().then(_handleDynamicUrl);
      }
    });
  }, [_handleDynamicUrl]);

  const handleDynamicLinkingOnAppStateChange = useCallback(() => {
    dynamicLinks().onLink(_handleDynamicUrl);
  }, [_handleDynamicUrl]);

  function switchToHomeStack() {
    handleDynamicLinkingOnBoot();
    setCurrentStack(HomeAppStack());
  }

  useEffect(() => {
    if (!isAppLoaded) {
      BootService.initialize().then(() => {
        setAppLoaded(true);
        SplashScreen.hide();
      });
    }
    LocalEvent.on(EventTypes.SwitchToHomeStack, switchToHomeStack);
    LocalEvent.on(
      EventTypes.AppState.Active,
      handleDynamicLinkingOnAppStateChange,
    );

    return () => {
      LocalEvent.off(EventTypes.SwitchToHomeStack, switchToHomeStack);
      LocalEvent.off(
        EventTypes.AppState.Active,
        handleDynamicLinkingOnAppStateChange,
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isAppLoaded) {
      const arePrefsSet = Cache.getValue(CacheKey.AreInitialPreferencesSet);
      if (arePrefsSet) {
        return switchToHomeStack();
      } else {
        return setCurrentStack(LaunchStack());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAppLoaded]);

  return currentStack || null;
}
const HomeAppStack = () => {
  return (
    <AppStack.Navigator>
      <AppStack.Screen
        name={ScreenName.HomeScreen}
        component={Navigation}
        options={{
          detachPreviousScreen: true,
          headerShown: false,
          gestureEnabled: false,
          cardOverlayEnabled: false,
          transitionSpec: {
            open: {animation: 'timing'},
            close: {animation: 'timing'},
          },
          cardStyleInterpolator: ({current}) => {
            return {
              cardStyle: {
                opacity: current.progress,
              },
            };
          },
        }}
      />
    </AppStack.Navigator>
  );
};
const LaunchStack = () => (
  <OnBoardingStack.Navigator>
    <OnBoardingStack.Screen
      name={ScreenName.LandingScreen}
      component={LandingScreen}
      options={{
        headerShown: false,
      }}
    />
    <OnBoardingStack.Screen
      name={ScreenName.PreferenceScreen}
      component={PreferenceScreen}
      options={{
        headerShown: false,
      }}
    />
    <OnBoardingStack.Screen
      name={ScreenName.RestoreScreen}
      component={RestoreScreen}
      options={{
        headerShown: false,
      }}
    />
    <OnBoardingStack.Screen
      name={ScreenName.InAppPdfViewerScreen}
      component={InAppPdfViewerScreen}
      options={{
        headerShown: false,
      }}
    />
  </OnBoardingStack.Navigator>
);

export default React.memo(RootNavigation);
