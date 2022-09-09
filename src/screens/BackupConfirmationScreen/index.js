import React from 'react';
import {Text, TextInput, View} from 'react-native';
import Header from '../../components/common/Header';
import RoundedButton from '../../components/common/RoundedButton';
import colors, {getColorWithOpacity} from '../../constants/colors';
import fonts from '../../constants/fonts';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import useBackupConfirmationScreenData from './useBackupConfirmationScreenData';

function BackupConfirmationScreen() {
  const {
    bIsButtonDisabled,
    bShowContinueWithPreviousPassword,
    sErrorText,
    fnOnContinueWithPreviousPasswordPress,
    fnOnContinueButtonPress,
    fnOnPasswordChange,
  } = useBackupConfirmationScreenData();
  const localStyle = useStyleProcessor(styles, 'BackupConfirmationScreen');
  return (
    <View style={localStyle.container}>
      <Header enableBackButton={true} />
      <TextInput
        testID="add_list_modal"
        style={localStyle.inputStyle}
        autoFocus={true}
        onChangeText={fnOnPasswordChange}
        placeholder={'Enter your Preferred Password'}
        placeholderTextColor={getColorWithOpacity(colors.BlackPearl, 0.5)}
        onSubmitEditing={fnOnContinueButtonPress}
        secureTextEntry={true}
        maxLength={64}
      />
      <Text style={localStyle.errorText}>{sErrorText}</Text>
      <RoundedButton
        style={localStyle.roundedButton}
        disabled={bIsButtonDisabled}
        text={'Continue'}
        textStyle={localStyle.roundedButtonText}
        onPress={fnOnContinueButtonPress}
        underlayColor={colors.GoldenTainoi80}
      />
      {bShowContinueWithPreviousPassword ? (
        <Text
          style={localStyle.linkText}
          onPress={fnOnContinueWithPreviousPasswordPress}>
          Continue with Previous password
        </Text>
      ) : null}
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
  linkText: {
    color: colors.GoldenTainoi,
    textAlign: 'center',
  },
};
export default React.memo(BackupConfirmationScreen);
