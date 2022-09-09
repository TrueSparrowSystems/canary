import {TextInput} from '@plgworks/applogger';
import React from 'react';
import {Text, View} from 'react-native';
import Header from '../../components/common/Header';
import RoundedButton from '../../components/common/RoundedButton';
import colors, {getColorWithOpacity} from '../../constants/colors';
import fonts from '../../constants/fonts';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import useRestoreScreenData from './useRestoreScreenData';

function RestoreScreen() {
  const localStyle = useStyleProcessor(styles, 'RestoreScreen');
  const {
    bShowPasswordField,
    sErrorText,
    sCanaryId,
    fnOnCanaryIdChange,
    fnOnPasswordChange,
    fnOnContinueButtonPress,
    fnOnConfirmButtonPress,
  } = useRestoreScreenData();
  return (
    <View style={localStyle.container}>
      <Header testID="restore_screen" enableBackButton={true} />
      <TextInput
        testID="restore_screen_canary_id"
        style={localStyle.inputStyle}
        defaultValue={sCanaryId}
        autoFocus={true}
        onChangeText={fnOnCanaryIdChange}
        placeholder={'Enter your Canary Id'}
        placeholderTextColor={getColorWithOpacity(colors.BlackPearl, 0.5)}
        onSubmitEditing={fnOnContinueButtonPress}
        maxLength={64}
      />
      {bShowPasswordField ? (
        <TextInput
          testID="restore_screen_password"
          style={localStyle.inputStyle}
          autoFocus={true}
          onChangeText={fnOnPasswordChange}
          placeholder={'Enter your Password'}
          placeholderTextColor={getColorWithOpacity(colors.BlackPearl, 0.5)}
          onSubmitEditing={fnOnConfirmButtonPress}
          secureTextEntry={true}
          maxLength={64}
        />
      ) : null}
      <Text style={localStyle.errorText}>{sErrorText}</Text>
      <RoundedButton
        testID="restore_screen_continue"
        style={localStyle.roundedButton}
        text={'Continue'}
        textStyle={localStyle.roundedButtonText}
        onPress={
          bShowPasswordField ? fnOnConfirmButtonPress : fnOnContinueButtonPress
        }
        underlayColor={colors.GoldenTainoi80}
      />
    </View>
  );
}
const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.White,
  },
  inputStyle: {
    marginTop: layoutPtToPx(20),
    fontFamily: fonts.InterRegular,
    height: layoutPtToPx(48),
    borderWidth: 1,
    borderColor: getColorWithOpacity(colors.Black, 0.2),
    color: colors.BlackPearl,
    fontSize: fontPtToPx(14),
    lineHeight: layoutPtToPx(18),
    width: '100%',
    borderRadius: layoutPtToPx(8),
    paddingHorizontal: layoutPtToPx(10),
  },
  errorText: {
    fontFamily: fonts.InterRegular,
    color: colors.BitterSweet,
    fontSize: fontPtToPx(12),
    textAlign: 'center',
  },
  roundedButton: {
    backgroundColor: colors.GoldenTainoi,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    height: layoutPtToPx(40),
    borderRadius: layoutPtToPx(25),
  },
  roundedButtonText: {
    marginHorizontal: layoutPtToPx(10),
    fontSize: fontPtToPx(14),
    justifyContent: 'center',
    alignItems: 'center',
    color: colors.BlackPearl,
    fontFamily: fonts.SoraSemiBold,
    textTransform: 'capitalize',
  },
};
export default React.memo(RestoreScreen);
