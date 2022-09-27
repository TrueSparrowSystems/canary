import {ComponentWrapper} from '@plgworks/applogger';
import React from 'react';
import {Image, Text, View} from 'react-native';
import {BackupImage} from '../../assets/common';
import Header from '../../components/common/Header';
import RoundedButton from '../../components/common/RoundedButton';
import colors, {getColorWithOpacity} from '../../constants/colors';
import fonts from '../../constants/fonts';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import useBackupIntroductionScreenData from './useBackupIntroductionScreenData';

function BackupIntroductionScreen() {
  const localStyle = useStyleProcessor(styles, 'BackupIntroductionScreen');
  const {fnOnBackupButtonPress, fnOnLinkTextPress} =
    useBackupIntroductionScreenData();
  return (
    <View style={localStyle.container}>
      <Header testID="backup_intro_screen" enableBackButton={true} />
      <View style={localStyle.contentContainer}>
        <Text style={localStyle.titleText}>Data backup</Text>
        <Text style={localStyle.headText}>
          Preferences, Lists & Archives will be encrypted & stored with us
          securely
        </Text>
        <Text style={localStyle.subHeadText}>
          Once your data is backed up you will receive a URL which can be used
          on any device to restore your data.
        </Text>
        <Image
          source={BackupImage}
          style={localStyle.imageStyle}
          resizeMode={'contain'}
        />
        <RoundedButton
          testID="backup_intro_screen"
          style={localStyle.roundedButton}
          text={'Back Up'}
          textStyle={localStyle.roundedButtonText}
          onPress={fnOnBackupButtonPress}
          underlayColor={colors.GoldenTainoi80}
        />
        <Text style={localStyle.footerText}>
          Your data is complely secure and encrypted!
        </Text>
        <ComponentWrapper>
          <Text
            style={localStyle.linkText}
            onPress={fnOnLinkTextPress}
            testID={'backup_intro_screen_link_text'}>
            See how we handle it.
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
  contentContainer: {
    marginHorizontal: layoutPtToPx(20),
  },
  titleText: {
    color: colors.BlackPearl,
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(32),
    lineHeight: layoutPtToPx(40),
    marginBottom: layoutPtToPx(40),
  },
  headText: {
    color: colors.BlackPearl,
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(20),
    lineHeight: layoutPtToPx(25),
    marginBottom: layoutPtToPx(4),
  },
  subHeadText: {
    color: getColorWithOpacity(colors.BlackPearl, 0.5),
    fontFamily: fonts.InterLight,
    fontSize: fontPtToPx(14),
    lineHeight: layoutPtToPx(17),
    marginBottom: layoutPtToPx(20),
  },
  imageStyle: {
    maxHeight: layoutPtToPx(150),
    width: '100%',
    alignSelf: 'center',
    borderRadius: layoutPtToPx(8),
    marginBottom: layoutPtToPx(40),
  },
  roundedButton: {
    backgroundColor: colors.GoldenTainoi,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: layoutPtToPx(40),
    borderRadius: layoutPtToPx(25),
    marginBottom: layoutPtToPx(40),
  },
  roundedButtonText: {
    marginHorizontal: layoutPtToPx(10),
    fontSize: fontPtToPx(14),
    justifyContent: 'center',
    alignItems: 'center',
    color: colors.BlackPearl,
    fontFamily: fonts.SoraSemiBold,
  },
  footerText: {
    color: colors.BlackPearl,
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(14),
    lineHeight: layoutPtToPx(17),
    textAlign: 'center',
    marginBottom: layoutPtToPx(10),
  },
  linkText: {
    color: colors.GoldenTainoi,
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(14),
    lineHeight: layoutPtToPx(17),
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
};

export default React.memo(BackupIntroductionScreen);
