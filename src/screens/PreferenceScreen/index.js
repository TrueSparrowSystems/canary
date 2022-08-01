import React from 'react';
import {View, Text, SafeAreaView} from 'react-native';
import {rightArrowIcon} from '../../assets/common';
import RoundedButton from '../../components/common/RoundedButton';
import PreferenceSelector from '../../components/PreferenceSelector';
import colors, {getColorWithOpacity} from '../../constants/colors';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import {usePreferenceScreenData} from './usePreferenceScreenData';
import fonts from '../../constants/fonts';
import DefaultTheme from '../../themes/DefaultTheme';
import {useStyle} from '../../hooks/useStyle';
import {useThemeContext} from '../../themes/ThemeContext';

function PreferenceScreen() {
  const localStyle = useStyle(getStyle, 'PreferenceScreen');

  const {bIsDoneButtonEnabled, fnOnSelectedItemsUpdate, fnOnDonePress} =
    usePreferenceScreenData();

  const {toggleTheme} = useThemeContext();

  return (
    <SafeAreaView>
      <View style={localStyle.container}>
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
        <View style={localStyle.continueButtonContainer}>
          <RoundedButton
            style={localStyle.continueButton}
            text="Change Theme"
            textStyle={localStyle.continueButtonText}
            onPress={toggleTheme}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

export default React.memo(PreferenceScreen);

const getStyle = () => {
  const defaultColors = DefaultTheme.getColors();
  return {
    container: {
      padding: layoutPtToPx(15),
      height: '100%',
    },
    titleText: {
      color: defaultColors.text,
      fontSize: fontPtToPx(40),
      fontFamily: fonts.SoraSemiBold,
    },
    subText: {
      color: getColorWithOpacity(defaultColors.text, 0.5),
      fontSize: fontPtToPx(14),
      marginTop: layoutPtToPx(4),
      fontFamily: fonts.InterRegular,
    },
    continueButton: {
      backgroundColor: defaultColors.primary,
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
      color: defaultColors.text,
      fontFamily: fonts.SoraSemiBold,
      textTransform: 'capitalize',
    },
    continueButtonIcon: {
      height: layoutPtToPx(18),
      width: layoutPtToPx(18),
    },
  };
};
