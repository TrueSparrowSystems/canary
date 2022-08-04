import React from 'react';
import {Image, Text, View} from 'react-native';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import {Canary, SettingsIcon} from '../../assets/common';
import useTimelineScreenData from './useTimelineScreenData';
import Header from '../../components/common/Header';
import colors from '../../constants/colors';
import TimelineList from '../../components/TimelineList';
import fonts from '../../constants/fonts';

function TimelineScreen() {
  const localStyle = useStyleProcessor(styles, 'TimelineScreen');

  const {fnOnSettingsPress, bRefreshing} = useTimelineScreenData();

  return (
    <View style={localStyle.container}>
      <View>
        <Header
          enableRightButton={true}
          onRightButtonClick={fnOnSettingsPress}
          rightButtonImage={SettingsIcon}
          text={
            <View style={localStyle.flexRow}>
              <Image source={Canary} style={localStyle.iconStyle} />
              <Text style={localStyle.appNameText}>Canary</Text>
            </View>
          }
        />
      </View>

      <TimelineList refreshData={bRefreshing} reloadData={false} />
    </View>
  );
}
export default React.memo(TimelineScreen);

const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.White,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
};
