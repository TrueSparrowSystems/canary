import React, {useEffect, useState} from 'react';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import ScreenName from '../constants/ScreenName';
import Navigation from '../Navigation';
import PreferenceScreen from '../screens/PreferenceScreen';

const AppStack = createSharedElementStackNavigator();
const PreferenceStack = createSharedElementStackNavigator();
function RootNavigation() {
  const [isAppLoaded, setAppLoaded] = useState(false);
  const [currentStack, setCurrentStack] = useState(LaunchStack());
  useEffect(() => {
    if (!isAppLoaded) {
      function loadApp() {
        setAppLoaded(true);
      }
      loadApp();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (isAppLoaded) {
      if (true) {
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
const LaunchStack = () => {
  <PreferenceStack.Navigator>
    <PreferenceStack.Screen
      name={ScreenName.PreferenceScreen}
      component={PreferenceScreen}
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
  </PreferenceStack.Navigator>;
};
export default React.memo(RootNavigation);
