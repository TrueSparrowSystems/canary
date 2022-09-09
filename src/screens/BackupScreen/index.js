import {ComponentWrapper} from '@plgworks/applogger';
import React from 'react';
import {Text, View} from 'react-native';
import Header from '../../components/common/Header';
import RoundedButton from '../../components/common/RoundedButton';
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import useBackupScreenData from './useBackupScreenData';

function BackupScreen() {
  const localStyle = useStyleProcessor(styles, 'BackupScreen');
  const {fnOnContinueButtonPress, fnOnBackupWithoutEncryptionPress} =
    useBackupScreenData();
  return (
    <View style={localStyle.container}>
      <Header testID="backup_screen" enableBackButton={true} />
      <View>
        <Text style={localStyle.headText}>
          Preferences, Lists & Archives will be encrypted & stored with us
          securely
        </Text>
        <Text style={localStyle.subHeadText}>
          To backup your data and retrive it on a device you would need to
          register your email address.
        </Text>
        <RoundedButton
          testID="backup_with_encryption"
          style={localStyle.roundedButton}
          text={'Continue with encryption'}
          textStyle={localStyle.roundedButtonText}
          onPress={fnOnContinueButtonPress}
          underlayColor={colors.GoldenTainoi80}
        />
        <ComponentWrapper>
          <Text
            testID="backup_without_encryption_text_button"
            style={localStyle.linkText}
            onPress={fnOnBackupWithoutEncryptionPress}>
            Continue without encryption
          </Text>
        </ComponentWrapper>
      </View>
    </View>
  );
}
const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.White,
  },
  headText: {
    color: colors.BlackPearl,
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(20),
    lineHeight: layoutPtToPx(25),
  },
  subHeadText: {
    color: colors.BlackPearl,
    fontFamily: fonts.InterLight,
    fontSize: fontPtToPx(14),
    lineHeight: layoutPtToPx(17),
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

export default React.memo(BackupScreen);
