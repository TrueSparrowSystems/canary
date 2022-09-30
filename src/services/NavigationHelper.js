import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {isTablet} from 'react-native-device-info';
import {Constants} from '../constants/Constants';

export const getTabBarVisibilityForTablet = routeName => {
  if (routeName && isTablet()) {
    return !Constants.ScreensToIgnoreForTabBarVisibility.Tablet.includes(
      routeName,
    );
  }
  return true;
};

export const getTabBarVisibilityForMobile = route => {
  if (route) {
    const routeName = getFocusedRouteNameFromRoute(route);
    return !Constants.ScreensToIgnoreForTabBarVisibility.Mobile.includes(
      routeName,
    );
  }
  return true;
};
