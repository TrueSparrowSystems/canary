import React from 'react';
import {View, Text, SafeAreaView} from 'react-native';
import {rightArrowIcon} from '../../assets/common';
import RoundedButton from '../../components/common/RoundedButton';
import PreferenceSelector from '../../components/PreferenceSelector';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import colors from '../../constants/colors';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import {usePreferenceScreenData} from './usePreferenceScreenData';
import fonts from '../../constants/fonts';

function PreferenceScreen() {
  const localStyle = useStyleProcessor(style, 'PreferenceScreen');

  const {bIsDoneButtonEnabled, fnOnSelectedItemsUpdate, fnOnDonePress} =
    usePreferenceScreenData();

  return (
    <SafeAreaView>
      <View style={localStyle.container}>
        <View>
          <Text style={localStyle.titleText}>Select Your Preferences</Text>
          <Text style={localStyle.subText}>minimum 3</Text>
        </View>
        <PreferenceSelector onSelectedItemsUpdate={fnOnSelectedItemsUpdate} />
        {bIsDoneButtonEnabled ? (
          <View style={localStyle.continueButtonContainer}>
            <RoundedButton
              style={localStyle.continueButton}
              text="Continue"
              textStyle={localStyle.continueButtonText}
              onPress={fnOnDonePress}
              rightImage={rightArrowIcon}
              rightImageStyle={localStyle.continueButtonIcon}
              underlayColor={colors.GoldenTainoi80}
            />
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

export default React.memo(PreferenceScreen);

const style = {
  container: {
    padding: layoutPtToPx(15),
    height: '100%',
  },
  titleText: {
    color: colors.BlackPearl,
    fontSize: fontPtToPx(40),
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
