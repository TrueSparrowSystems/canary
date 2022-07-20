import React from 'react';
import {SafeAreaView, View, Text} from 'react-native';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import {SettingsIcon} from '../../assets/common';
import useTimelineScreenData from './useTimelineScreenData';
import Header from '../../components/common/Header';
import colors from '../../utils/colors';

function TimelineScreen() {
  const localStyle = useStyleProcessor(styles, 'TimelineScreen');

  const {fnOnSettingsPress} = useTimelineScreenData();

  return (
    <SafeAreaView>
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
      </View>
    </SafeAreaView>
  );
}

export default React.memo(TimelineScreen);

const styles = {
  container: {paddingHorizontal: layoutPtToPx(10)},
  appNameText: {
    color: colors.DodgerBlue,
    fontSize: fontPtToPx(35),
  },
};
