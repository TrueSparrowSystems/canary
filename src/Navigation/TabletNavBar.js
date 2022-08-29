import React, {useCallback} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import BottomNavigationText from '../components/BottomNavigationText';
import colors from '../constants/colors';
import fonts from '../constants/fonts';
import {useStyleProcessor} from '../hooks/useStyleProcessor';
import {fontPtToPx, layoutPtToPx} from '../utils/responsiveUI';

function TabletNavBar({state, descriptors, navigation, tabName, tabIcons}) {
  const localStyle = useStyleProcessor(styles, 'TabletNavBar');

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
  return (
    <View style={localStyle.container}>
      <View style={localStyle.tabBar}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];

          const isFocused = state.index === index;

          const onPress = () => {
            navigation.navigate(route.name);
          };

          return (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={isFocused ? {selected: true} : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              style={localStyle.flex1}>
              <View style={localStyle.tabIconContainer}>
                <Image
                  source={tabIcons[index]}
                  style={getBottomTabIconStyle(isFocused)}
                />
                <BottomNavigationText
                  style={localStyle.text}
                  focused={isFocused}
                  text={tabName[index]}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
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
  tabBar: {height: '30%'},
  flex1: {flex: 1},
  text: {
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(10),
    marginBottom: layoutPtToPx(10),
    color: colors.BlackPearl,
    textTransform: 'capitalize',
    textAlign: 'center',
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
