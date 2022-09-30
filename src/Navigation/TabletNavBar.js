import {TouchableOpacity} from '@plgworks/applogger';
import React, {useCallback, useMemo} from 'react';
import {Image, View} from 'react-native';
import {
  BottomBarListIcon,
  Canary,
  CollectionsIcon,
  HomeIcon,
  SearchIcon,
} from '../assets/common';
import BottomNavigationText from '../components/BottomNavigationText';
import colors from '../constants/colors';
import fonts from '../constants/fonts';
import ScreenName from '../constants/ScreenName';
import {useOrientationState} from '../hooks/useOrientation';
import {useStyleProcessor} from '../hooks/useStyleProcessor';
import {getTabBarVisibilityForTablet} from '../services/NavigationHelper';
import NavigationService from '../services/NavigationService';
import {fontPtToPx, layoutPtToPx} from '../utils/responsiveUI';

function TabletNavBar({state, descriptors, navigation}) {
  const localStyle = useStyleProcessor(styles, 'TabletNavBar');
  const tabName = useMemo(() => ['Home', 'Search', 'Lists', 'Archives'], []);
  const tabIcons = useMemo(
    () => [HomeIcon, SearchIcon, BottomBarListIcon, CollectionsIcon],
    [],
  );

  useOrientationState();
  const currentRouteName = NavigationService.getCurrentRouteName();
  const isTabBarVisible = getTabBarVisibilityForTablet(currentRouteName);

  const getBottomTabIconStyle = useCallback(
    isFocused => {
      return [
        localStyle.bottomTabIcons,
        {
          opacity: isFocused ? 1 : 0.5,
        },
      ];
    },
    [localStyle.bottomTabIcons],
  );

  const iconStyle = useCallback(
    isHidden => [localStyle.flex1, {opacity: isHidden ? 0 : 1}],
    [localStyle.flex1],
  );

  const RenderComponent = useCallback(
    ({
      isFocused,
      options,
      onPress,
      route,
      index,
      showText = true,
      icon,
      isHidden = false,
    }) => {
      return (
        <TouchableOpacity
          testID="tablet_nav_bar"
          accessibilityRole="button"
          accessibilityState={isFocused ? {selected: true} : {}}
          accessibilityLabel={options.tabBarAccessibilityLabel}
          onPress={onPress}
          style={iconStyle(isHidden)}
          key={route.key}>
          <View style={localStyle.tabIconContainer}>
            {icon ? (
              <Image source={icon} style={localStyle.iconStyle} />
            ) : (
              <Image
                source={tabIcons[index]}
                style={getBottomTabIconStyle(isFocused)}
              />
            )}
            {showText ? (
              <BottomNavigationText
                style={localStyle.text}
                focused={isFocused}
                text={tabName[index]}
              />
            ) : null}
          </View>
        </TouchableOpacity>
      );
    },
    [
      getBottomTabIconStyle,
      iconStyle,
      localStyle.iconStyle,
      localStyle.tabIconContainer,
      localStyle.text,
      tabIcons,
      tabName,
    ],
  );

  return isTabBarVisible ? (
    <View style={localStyle.container}>
      <View style={localStyle.tabBar}>
        {RenderComponent({
          isHidden: currentRouteName === ScreenName.TimelineScreen,
          isFocused: false,
          options: descriptors[state.routes[0].key].options,
          onPress: () => {
            navigation.navigate(ScreenName.TimelineScreen);
          },
          route: state.routes[0],
          index: 0,
          showText: false,
          icon: Canary,
        })}
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];

          const isFocused = state.index === index;

          const onPress = () => {
            navigation.navigate(route.name);
          };

          return RenderComponent({isFocused, options, onPress, route, index});
        })}
      </View>
    </View>
  ) : null;
}

const styles = {
  container: {
    height: '100%',
    position: 'absolute',
    borderRightColor: colors.LightGrey,
    backgroundColor: colors.White,
    width: layoutPtToPx(90),
    borderRightWidth: 1,
  },
  tabBar: {
    height: '30%',
    tablet: {
      landscape: {
        height: '45%',
      },
    },
  },
  flex1: {flex: 1},
  text: {
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(10),
    marginBottom: layoutPtToPx(10),
    color: colors.BlackPearl,
    textTransform: 'capitalize',
    textAlign: 'center',
  },

  iconStyle: {
    height: layoutPtToPx(34),
    width: layoutPtToPx(34),
  },
  bottomTabIcons: {
    height: layoutPtToPx(16),
    width: layoutPtToPx(16),
    marginBottom: layoutPtToPx(10),
  },
  tabIconContainer: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 2,
    borderTopColor: colors.Transparent,
  },
  selectedTabContainer: {
    borderTopColor: colors.BlackPearl,
    borderTopWidth: 2,
  },
};
export default React.memo(TabletNavBar);
