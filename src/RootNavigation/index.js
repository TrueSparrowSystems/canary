import React, {useEffect, useState} from 'react';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import ScreenName from '../constants/ScreenName';
import Navigation from '../Navigation';
import PreferenceScreen from '../screens/PreferenceScreen';
import AsyncStorage from '../services/AsyncStorage';
import {StoreKeys} from '../services/AsyncStorage/StoreConstants';
import Cache from '../services/Cache';
import {CacheKey} from '../services/Cache/CacheStoreConstants';
import {networkConnection} from '../services/NetworkConnection';
import {EventTypes, LocalEvent} from '../utils/LocalEvent';

const AppStack = createSharedElementStackNavigator();
const PreferenceStack = createSharedElementStackNavigator();
function RootNavigation() {
  const [isAppLoaded, setAppLoaded] = useState(false);
  const [currentStack, setCurrentStack] = useState();

  function switchToHomeStack() {
    setCurrentStack(HomeAppStack());
  }

  function loadApp() {
    networkConnection();
    AsyncStorage.getItem(StoreKeys.AreInitialPreferencesSet).then(isSet => {
      Cache.setValue(CacheKey.AreInitialPreferencesSet, isSet);
      if (isSet) {
        AsyncStorage.getItem(StoreKeys.PreferenceList).then(list => {
          AsyncStorage.get(StoreKeys.BookmarkedTweetsList).then(
            bookmarkedTweetList => {
              Cache.setValue(
                CacheKey.BookmarkedTweetsList,
                JSON.parse(bookmarkedTweetList),
              );
            },
          );
          Cache.setValue(CacheKey.PreferenceList, list);
          setAppLoaded(true);
        });
      } else {
        setAppLoaded(true);
      }
    });
  }

  useEffect(() => {
    if (!isAppLoaded) {
      loadApp();
    }
    LocalEvent.on(EventTypes.SwitchToHomeStack, switchToHomeStack);
    return () => {
      LocalEvent.off(EventTypes.SwitchToHomeStack, switchToHomeStack);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isAppLoaded) {
      const arePrefsSet = Cache.getValue(CacheKey.AreInitialPreferencesSet);
      if (arePrefsSet) {
        return setCurrentStack(HomeAppStack());
      } else {
        return setCurrentStack(LaunchStack());
      }
    }
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
  <PreferenceStack.Navigator>
    <PreferenceStack.Screen
      name={ScreenName.PreferenceScreen}
      component={PreferenceScreen}
      options={{
        headerShown: false,
      }}
    />
  </PreferenceStack.Navigator>
);

export default React.memo(RootNavigation);
