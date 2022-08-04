import React from 'react';
import {View, Text} from 'react-native';
import {rightArrowIcon} from '../../assets/common';
import RoundedButton from '../../components/common/RoundedButton';
import PreferenceSelector from '../../components/PreferenceSelector';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import colors from '../../constants/colors';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import {usePreferenceScreenData} from './usePreferenceScreenData';
import fonts from '../../constants/fonts';
import Header from '../../components/common/Header';

function PreferenceScreen(props) {
  const localStyle = useStyleProcessor(style, 'PreferenceScreen');
  const data = props?.route?.params;
  const {bIsDoneButtonEnabled, fnOnSelectedItemsUpdate, fnOnDonePress} =
    usePreferenceScreenData();

  return (
    <View style={localStyle.container}>
      <Header enableBackButton={!!data?.enableBackButton} />
      <View style={localStyle.contentContainer}>
        <View>
          <Text style={localStyle.titleText}>Select Your Preferences</Text>
          <Text style={localStyle.subText}>minimum 3</Text>
        </View>
        <PreferenceSelector onSelectedItemsUpdate={fnOnSelectedItemsUpdate} />

        <View style={localStyle.continueButtonContainer}>
          <RoundedButton
            style={localStyle.continueButton}
            text="Continue"
            disabled={!bIsDoneButtonEnabled}
            textStyle={localStyle.continueButtonText}
            onPress={fnOnDonePress}
            rightImage={rightArrowIcon}
            rightImageStyle={localStyle.continueButtonIcon}
            underlayColor={colors.GoldenTainoi80}
          />
        </View>
      </View>
    </View>
  );
}

export default React.memo(PreferenceScreen);

const style = {
  container: {
    height: '100%',
    backgroundColor: colors.White,
  },
  contentContainer: {
    padding: layoutPtToPx(15),
  },
  cancelTextStyle: {
    color: colors.GoldenTainoi,
    fontSize: fontPtToPx(14),
    lineHeight: layoutPtToPx(18),
    fontFamily: fonts.SoraSemiBold,
  },
  titleText: {
    color: colors.BlackPearl,
    fontSize: fontPtToPx(40),
    lineHeight: layoutPtToPx(50),
    fontFamily: fonts.SoraSemiBold,
  },
  subText: {
    color: colors.BlackPearl50,
    fontSize: fontPtToPx(14),
    marginTop: layoutPtToPx(4),
    fontFamily: fonts.InterRegular,
  },
  continueButton: {
    backgroundColor: colors.GoldenTainoi,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: layoutPtToPx(40),
    borderRadius: layoutPtToPx(25),
  },
  continueButtonText: {
    marginHorizontal: layoutPtToPx(10),
    fontSize: fontPtToPx(14),
    justifyContent: 'center',
    alignItems: 'center',
    letterSpacing: 1.2,
    color: colors.BlackPearl,
    fontFamily: fonts.SoraSemiBold,
    textTransform: 'capitalize',
  },
  continueButtonIcon: {
    height: layoutPtToPx(18),
    width: layoutPtToPx(18),
  },
};
