import React, {useCallback, useMemo, useRef} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import {Canary, SettingsIcon} from '../../assets/common';
import useTimelineScreenData from './useTimelineScreenData';
import Header from '../../components/common/Header';
import colors from '../../constants/colors';
import TimelineList from '../../components/TimelineList';
import fonts from '../../constants/fonts';
import useTabListener from '../../hooks/useTabListener';
import {isTablet} from 'react-native-device-info';
import {useOrientationState} from '../../hooks/useOrientation';
import SearchScreenContent from '../../components/SearchScreenContent';

function TimelineScreen(props) {
  const localStyle = useStyleProcessor(styles, 'TimelineScreen');

  const {isPortrait} = useOrientationState();
  const isTabletLandscape = useMemo(
    () => isTablet() && !isPortrait,
    [isPortrait],
  );

  const {fnOnSettingsPress, bRefreshing} = useTimelineScreenData();
  const screenName = props?.route?.name;
  const scrollRef = useRef(null);

  const scrollToTop = useCallback(() => {
    scrollRef.current?.scrollToOffset({
      animated: true,
      offset: 0,
    });
  }, []);
  useTabListener(screenName, scrollToTop);

  return (
    <View style={localStyle.container}>
      <View style={localStyle.flexRow}>
        <View style={localStyle.listComponent}>
          <Header
            enableRightButton={true}
            onRightButtonClick={fnOnSettingsPress}
            rightButtonImage={SettingsIcon}
            text={
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={scrollToTop}
                style={localStyle.flexRow}>
                <Image source={Canary} style={localStyle.iconStyle} />
                <Text style={localStyle.appNameText}>Canary</Text>
              </TouchableOpacity>
            }
          />

          <TimelineList
            listRef={scrollRef}
            refreshData={bRefreshing}
            reloadData={false}
          />
        </View>
        {isTabletLandscape ? <SearchScreenContent /> : null}
      </View>
    </View>
  );
}
export default React.memo(TimelineScreen);

const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.White,
  },
  listComponent: {
    tablet: {
      landscape: {
        width: '70%',
        borderRightWidth: 1,
        borderRightColor: colors.BlackPearl20,
      },
    },
  },
  iconStyle: {
    height: layoutPtToPx(24),
    width: layoutPtToPx(24),
  },
  appNameText: {
    color: colors.BlackPearl,
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(16),
    lineHeight: layoutPtToPx(20),
    marginLeft: layoutPtToPx(4),
  },
  flexRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
};
