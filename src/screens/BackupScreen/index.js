import {TouchableOpacity} from '@plgworks/applogger';
import React from 'react';
import {ActivityIndicator, Image, Text, View} from 'react-native';
import {CopyIcon, ShareIcon} from '../../assets/common';
import Header from '../../components/common/Header';
import RoundedButton from '../../components/common/RoundedButton';
import colors, {getColorWithOpacity} from '../../constants/colors';
import fonts from '../../constants/fonts';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import useBackupScreenData from './useBackupScreenData';

function BackupScreen() {
  const localStyle = useStyleProcessor(styles, 'BackupScreen');

  const {
    bIsLoading,
    sBackupTimeStamp,
    sBackupUrl,
    fnOnBackupButtonPress,
    fnOnCopyLinkPress,
    fnOnShareButtonPress,
  } = useBackupScreenData();

  return (
    <View style={localStyle.container}>
      <Header testID="backup_intro_screen" enableBackButton={true} />
      <View style={localStyle.contentContainer}>
        <Text style={localStyle.titleText}>Data backup</Text>
        {bIsLoading ? (
          <ActivityIndicator animating={bIsLoading} />
        ) : (
          <View>
            <View style={localStyle.card}>
              <Text style={localStyle.cardHeadText}>
                Your data is encrypted and backed up with us!
              </Text>
              <Text style={localStyle.lastBackupText}>
                Last backup dated {sBackupTimeStamp}
              </Text>
              <View style={localStyle.copyBackupUrlContainer}>
                <Text style={localStyle.backupUrlText} numberOfLines={1}>
                  {sBackupUrl}
                </Text>
                <TouchableOpacity
                  onPress={fnOnCopyLinkPress}
                  style={localStyle.copyIconContainer}
                  testID={'backup_screen_copy_button'}>
                  <Image style={localStyle.copyUrlIcon} source={CopyIcon} />
                </TouchableOpacity>
              </View>
              <Text style={localStyle.cardFootText}>
                We recommend you to copy this url and keep it safe
              </Text>
            </View>
            <RoundedButton
              testID="backup_screen_backup"
              style={localStyle.roundedButton}
              text={'Back Up'}
              textStyle={localStyle.roundedButtonText}
              onPress={fnOnBackupButtonPress}
              underlayColor={colors.GoldenTainoi80}
            />
            <RoundedButton
              testID="backup_screen_share"
              style={localStyle.secondaryRoundedButton}
              text={'Share'}
              textStyle={localStyle.secondaryRoundedButtonText}
              rightImage={ShareIcon}
              rightImageStyle={localStyle.buttonImageStyle}
              onPress={fnOnShareButtonPress}
              underlayColor={getColorWithOpacity(colors.Black, 0.2)}
            />
          </View>
        )}
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
  card: {
    borderWidth: 1,
    borderColor: colors.GoldenTainoi,
    borderRadius: layoutPtToPx(8),
    overflow: 'hidden',
  },
  cardHeadText: {
    color: colors.BlackPearl,
    fontFamily: fonts.InterRegular,
    fontSize: fontPtToPx(14),
    lineHeight: layoutPtToPx(17),
    backgroundColor: colors.GoldenTainoi,
    textAlign: 'center',
    paddingVertical: layoutPtToPx(6),
    marginBottom: layoutPtToPx(15),
  },
  lastBackupText: {
    color: colors.BlackPearl,
    fontFamily: fonts.InterRegular,
    fontSize: fontPtToPx(14),
    lineHeight: layoutPtToPx(17),
    textAlign: 'center',
    marginBottom: layoutPtToPx(19),
  },
  copyBackupUrlContainer: {
    borderWidth: 1,
    borderColor: getColorWithOpacity(colors.BlackPearl, 0.2),
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: layoutPtToPx(11),
    marginTop: 0,
    borderRadius: layoutPtToPx(4),
    padding: layoutPtToPx(10),
    alignItems: 'center',
  },
  backupUrlText: {
    color: colors.GoldenTainoi,
    fontFamily: fonts.InterSemiBold,
    fontSize: fontPtToPx(14),
    lineHeight: layoutPtToPx(17),
    textDecorationLine: 'underline',
    flexShrink: 1,
  },
  copyIconContainer: {
    flexGrow: 1,
    alignItems: 'flex-end',
  },
  copyUrlIcon: {
    height: layoutPtToPx(17),
    width: layoutPtToPx(17),
    margin: layoutPtToPx(10),
  },
  cardFootText: {
    color: getColorWithOpacity(colors.BlackPearl, 0.5),
    fontFamily: fonts.InterSemiBold,
    fontSize: fontPtToPx(14),
    lineHeight: layoutPtToPx(17),
    textAlign: 'center',
    marginBottom: layoutPtToPx(20),
    marginHorizontal: layoutPtToPx(10),
  },
  roundedButton: {
    backgroundColor: colors.GoldenTainoi,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: layoutPtToPx(40),
    borderRadius: layoutPtToPx(25),
    marginBottom: layoutPtToPx(20),
    marginTop: layoutPtToPx(40),
  },
  roundedButtonText: {
    fontSize: fontPtToPx(14),
    justifyContent: 'center',
    alignItems: 'center',
    color: colors.BlackPearl,
    fontFamily: fonts.SoraSemiBold,
  },
  secondaryRoundedButton: {
    borderWidth: 1,
    borderColor: colors.BlackPearl,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: layoutPtToPx(40),
    borderRadius: layoutPtToPx(25),
  },
  secondaryRoundedButtonText: {
    fontSize: fontPtToPx(14),
    justifyContent: 'center',
    alignItems: 'center',
    color: colors.BlackPearl,
    fontFamily: fonts.SoraSemiBold,
  },
  buttonImageStyle: {
    height: layoutPtToPx(14),
    width: layoutPtToPx(14),
    marginLeft: layoutPtToPx(6),
  },
};
export default React.memo(BackupScreen);
