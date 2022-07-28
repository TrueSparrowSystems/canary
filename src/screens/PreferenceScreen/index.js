import React from 'react';
import {View, Text, SafeAreaView} from 'react-native';
import RoundedButton from '../../components/common/RoundedButton';
import PreferenceSelector from '../../components/PreferenceSelector';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import colors from '../../utils/colors';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import {usePreferenceScreenData} from './usePreferenceScreenData';

function PreferenceScreen() {
  const localStyle = useStyleProcessor(style, 'PreferenceScreen');

  const {bIsDoneButtonEnabled, fnOnSelectedItemsUpdate, fnOnDonePress} =
    usePreferenceScreenData();

  return (
    <SafeAreaView>
      <View style={localStyle.container}>
        <View>
          <Text style={localStyle.titleText}>Select Your Preferences</Text>
          <Text style={localStyle.subText}>Select minimum 3 options</Text>
        </View>
        <PreferenceSelector onSelectedItemsUpdate={fnOnSelectedItemsUpdate} />
        {bIsDoneButtonEnabled ? (
          <View style={localStyle.continueButtonContainer}>
            <RoundedButton
              style={localStyle.continueButton}
              text="✓"
              textStyle={localStyle.continueButtonText}
              onPress={fnOnDonePress}
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
  },
  titleText: {
    color: colors.DodgerBlue,
    fontSize: fontPtToPx(45),
  },
  subText: {
    color: colors.Gothic,
    fontSize: fontPtToPx(15),
    marginTop: layoutPtToPx(10),
  },
  continueButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  continueButton: {
    backgroundColor: colors.DodgerBlue,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: layoutPtToPx(50),
    height: layoutPtToPx(50),
    borderRadius: layoutPtToPx(25),
    borderColor: colors.DodgerBlue,
    borderWidth: layoutPtToPx(1),
  },
  continueButtonText: {
    marginHorizontal: layoutPtToPx(10),
    // fontFamily: 'OpenSans-SemiBold',
    fontSize: fontPtToPx(20),
    justifyContent: 'center',
    alignItems: 'center',
    letterSpacing: 1.2,
    color: colors.White,
  },
};
