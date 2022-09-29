import React from 'react';
import {ActivityIndicator, Text, TextInput, View} from 'react-native';
import Header from '../../components/common/Header';
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import {getColorWithOpacity} from '../../constants/colors';
import RoundedButton from '../../components/common/RoundedButton';
import useRestoreScreenData from './useRestoreScreenData';

function RestoreScreen(props) {
  const localStyle = useStyleProcessor(styles, 'RestoreScreen');
  const params = props?.route?.params;

  const {
    bIsLoading,
    sBackupUrl,
    sRestoreText,
    sErrorText,
    fnOnBackupUrlChange,
    fnOnConfirmButtonPress,
    fnOnLinkTextPress,
  } = useRestoreScreenData(params);

  return (
    <View style={localStyle.container}>
      <Header
        style={localStyle.headerStyle}
        testID="restore_screen"
        enableBackButton={true}
      />
      <Text style={localStyle.headerText}>Restore Data</Text>
      {bIsLoading ? (
        <ActivityIndicator animating={bIsLoading} />
      ) : (
        <View style={localStyle.flex}>
          {params?.isOnboardingFlow ? (
            <Text style={localStyle.alreadyUsingCanaryText}>
              If you are already using Canary you can use you backup URL to
              restore all your data.
            </Text>
          ) : null}
          <Text style={localStyle.secondaryHeaderText}>
            Please enter your backup URL
          </Text>
          {!params?.isOnboardingFlow && sRestoreText ? (
            <Text style={localStyle.restoreTimeText}>{sRestoreText}</Text>
          ) : null}
          <TextInput
            testID="restore_screen_canary_id"
            style={localStyle.inputStyle}
            defaultValue={sBackupUrl}
            autoFocus={true}
            onChangeText={fnOnBackupUrlChange}
            placeholder={'Paste your backup URL'}
            placeholderTextColor={getColorWithOpacity(colors.BlackPearl, 0.5)}
            onSubmitEditing={fnOnConfirmButtonPress}
            maxLength={64}
          />
          <Text style={localStyle.errorText}>{sErrorText}</Text>
          <RoundedButton
            testID="restore_screen_submit"
            style={localStyle.roundedButton}
            text={'Restore Data'}
            textStyle={localStyle.roundedButtonText}
            onPress={fnOnConfirmButtonPress}
            underlayColor={colors.GoldenTainoi80}
          />
          <Text style={localStyle.cantFindText} onPress={fnOnLinkTextPress}>
            Can’t find your backup URL! Read this.
          </Text>
          <View style={localStyle.restartTextView}>
            <Text style={localStyle.restartText}>
              Restoring data will restart your app!
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.White,
    paddingHorizontal: layoutPtToPx(20),
  },
  headerStyle: {
    height: layoutPtToPx(50),
    justifyContent: 'center',
  },
  alreadyUsingCanaryText: {
    fontFamily: fonts.InterMedium,
    fontSize: fontPtToPx(16),
    lineHeight: layoutPtToPx(24),
    color: colors.BlackPearl,
    marginTop: layoutPtToPx(5),
  },
  headerText: {
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(32),
    lineHeight: layoutPtToPx(40),
    color: colors.BlackPearl,
  },
  flex: {
    flex: 1,
  },
  secondaryHeaderText: {
    marginTop: layoutPtToPx(40),
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(20),
    lineHeight: layoutPtToPx(25),
    color: colors.BlackPearl,
  },
  inputStyle: {
    marginTop: layoutPtToPx(20),
    fontFamily: fonts.InterRegular,
    height: layoutPtToPx(48),
    borderWidth: 1,
    borderColor: getColorWithOpacity(colors.Black, 0.2),
    color: colors.GoldenTainoi,
    fontSize: fontPtToPx(14),
    lineHeight: layoutPtToPx(17),
    width: '100%',
    borderRadius: layoutPtToPx(8),
    paddingHorizontal: layoutPtToPx(10),
  },
  roundedButton: {
    marginTop: layoutPtToPx(30),
    backgroundColor: colors.GoldenTainoi,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
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
  cantFindText: {
    marginTop: layoutPtToPx(40),
    fontFamily: fonts.InterSemiBold,
    fontSize: fontPtToPx(14),
    lineHeight: layoutPtToPx(17),
    color: colors.GoldenTainoi,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  restartTextView: {
    justifyContent: 'flex-end',
    flex: 1,
    marginBottom: layoutPtToPx(20),
  },
  restartText: {
    fontFamily: fonts.InterRegular,
    fontSize: fontPtToPx(14),
    lineHeight: layoutPtToPx(17),
    color: colors.BlackPearl,
    textAlign: 'center',
  },
  restoreTimeText: {
    marginTop: layoutPtToPx(4),
    fontFamily: fonts.InterLight,
    fontSize: fontPtToPx(14),
    lineHeight: layoutPtToPx(17),
    color: colors.BlackPearl,
  },
  errorText: {
    marginTop: layoutPtToPx(4),
    fontFamily: fonts.InterRegular,
    fontSize: fontPtToPx(14),
    lineHeight: layoutPtToPx(17),
    height: layoutPtToPx(17),
    color: colors.BitterSweet,
    textAlign: 'center',
  },
};

export default React.memo(RestoreScreen);
