import React from 'react';
import {View} from 'react-native';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import {SettingsIcon} from '../../assets/common';
import useTimelineScreenData from './useTimelineScreenData';
import Header from '../../components/common/Header';
import colors from '../../utils/colors';
import TimelineList from '../../components/TimelineList';

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
          text="Twitter.me"
          textStyle={localStyle.appNameText}
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
    paddingHorizontal: layoutPtToPx(10),
    backgroundColor: colors.White,
  },
  appNameText: {
    color: colors.DodgerBlue,
    fontSize: fontPtToPx(35),
  },
};
