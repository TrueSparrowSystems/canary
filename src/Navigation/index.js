import React, {useCallback} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {isTablet} from 'react-native-device-info';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TransitionPresets} from '@react-navigation/stack';
import ScreenName from '../constants/ScreenName';
import TimelineScreen from '../screens/TimelineScreen';
import CollectionScreen from '../screens/CollectionScreen';
import SettingScreen from '../screens/SettingScreen';
import BottomNavigationText from '../components/common/BottomNavigationText';
// import BottomNavigationIcon from '../components/common/BottomNavigationIcon';

// TODO: Please correct he screen names.
const Navigation = props => {
  const Tab = createBottomTabNavigator();
  const TimelineStack = createSharedElementStackNavigator();
  const CollectionStack = createSharedElementStackNavigator();
  const SettingStack = createSharedElementStackNavigator();
  const {bottom} = useSafeAreaInsets();

  function TimelineTabStack() {
    return (
      <TimelineStack.Navigator detachInactiveScreens={true}>
        <TimelineStack.Screen
          name={ScreenName.TimelineScreen}
          component={TimelineScreen}
          options={{
            headerShown: false,
            headerMode: 'none',
            detachPreviousScreen: true,
          }}
        />
      </TimelineStack.Navigator>
    );
  }

  const getTabBarVisibility = route => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName === ScreenName.PreferenceScreen) {
      return false;
    }
    return true;
  };

  const bottomStack = useCallback(bottomHeight => {
    const tabbarStyle = {height: 40 + bottomHeight};
    return (
      <Tab.Navigator
        detachInactiveScreens={true}
        initialRouteName={ScreenName.HomeScreen}
        screenOptions={{tabBarHideOnKeyboard: true}}>
        <Tab.Screen
          options={({route}) => {
            return {
              // tabBarIcon: ({focused}) => (
              //   <BottomNavigationIcon image={focused ? HomeActive : Home} />
              // ),
              tabBarLabel: ({focused}) => (
                <BottomNavigationText focused={focused} text={'Timeline'} />
              ),
              tabBarLabelPosition: isTablet() ? 'beside-icon' : 'below-icon',
              tabBarStyle: getTabBarVisibility(route)
                ? tabbarStyle
                : {display: 'none'},
              headerShown: false,
            };
          }}
          name={ScreenName.TimelineTab}
          title={'Timeline'}
          component={TimelineTabStack}
        />
        <Tab.Screen
          options={({route}) => {
            return {
              // tabBarIcon: ({focused}) => (
              //   <BottomNavigationIcon
              //     image={focused ? WorkoutsActive : Workouts}
              //   />
              // ),
              tabBarLabel: ({focused}) => (
                <BottomNavigationText focused={focused} text={'Collection'} />
              ),
              tabBarLabelPosition: isTablet() ? 'beside-icon' : 'below-icon',
              tabBarStyle: getTabBarVisibility(route)
                ? tabbarStyle
                : {display: 'none'},
              headerShown: false,
              lazy: false,
            };
          }}
          name={ScreenName.CollectionTab}
          title={'Collection'}
          component={CollectionTabStack}
        />
        <Tab.Screen
          options={({route}) => ({
            // tabBarIcon: ({focused}) => (
            //   <BottomNavigationIcon image={focused ? SearchActive : Search} />
            // ),
            tabBarLabel: ({focused}) => (
              <BottomNavigationText focused={focused} text={'Settings'} />
            ),
            tabBarLabelPosition: isTablet() ? 'beside-icon' : 'below-icon',
            tabBarStyle: getTabBarVisibility(route)
              ? tabbarStyle
              : {display: 'none'},
            headerShown: false,
          })}
          name={ScreenName.SettingTab}
          title={'Settings'}
          component={SettingTabStack}
        />
      </Tab.Navigator>
    );
  }, []);

  function CollectionTabStack() {
    return (
      <CollectionStack.Navigator detachInactiveScreens={true}>
        <CollectionStack.Screen
          name={ScreenName.CollectionScreen}
          component={CollectionScreen}
          options={{
            headerShown: false,
            tabBarVisible: false,
            detachPreviousScreen: true,
          }}
        />
      </CollectionStack.Navigator>
    );
  }

  function SettingTabStack() {
    return (
      <SettingStack.Navigator>
        <SettingStack.Screen
          name={ScreenName.SettingScreen}
          component={SettingScreen}
          options={{
            gestureEnabled: true,
            headerShown: false,
            tabBarVisible: false,
            detachPreviousScreen: true,
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
      </SettingStack.Navigator>
    );
  }

  return bottomStack(bottom);
};

export default Navigation;
