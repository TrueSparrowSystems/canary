import {TouchableOpacity} from '@plgworks/applogger';
import React, {useMemo} from 'react';
import {Image, Linking, Text, View} from 'react-native';
import {AppVersion} from '../../../AppVersion';
import {
  Canary,
  Information,
  rightArrowIcon,
  ShareAppIcon,
} from '../../assets/common';
import Header from '../../components/common/Header';
import RoundedButton from '../../components/common/RoundedButton';
import colors from '../../constants/colors';
import {Constants} from '../../constants/Constants';
import fonts from '../../constants/fonts';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import BackupRestoreHelper from '../../services/BackupRestoreHelper';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import useSettingScreenData from './useSettingScreenData';

function SettingScreen() {
  const localStyle = useStyleProcessor(styles, 'SettingScreen');
  const {
    sLastBackUpTimeStamp,
    fnOnInfoPress,
    fnOnShareAppPress,
    fnOnPersonalizeFeedPress,
  } = useSettingScreenData();
  const _backUpRestoreHelper = BackupRestoreHelper;

  const Card = useMemo(
    () =>
      ({titleText, subTitleText, onPress}) => {
        return (
          <TouchableOpacity
            testID={`setting_screen_${titleText}_card`}
            onPress={onPress}
            style={localStyle.cardContainer}>
            <View style={localStyle.cardDetailBox}>
              <Text style={localStyle.titleText}>{titleText}</Text>
              <Text style={localStyle.subTitleText}>{subTitleText}</Text>
            </View>
            <Image source={rightArrowIcon} style={localStyle.arrowStyle} />
          </TouchableOpacity>
        );
      },
    [
      localStyle.arrowStyle,
      localStyle.cardContainer,
      localStyle.cardDetailBox,
      localStyle.subTitleText,
      localStyle.titleText,
    ],
  );

  return (
    <View style={localStyle.screen}>
      <Header
        testId={'setting_screen'}
        enableBackButton={true}
        enableRightButton={true}
        onRightButtonClick={fnOnShareAppPress}
        rightButtonImage={ShareAppIcon}
        rightButtonImageStyle={localStyle.header.rightButtonImageStyle}
        enableSecondaryRightButton={true}
        onSecondaryRightButtonClick={fnOnInfoPress}
        secondaryRightButtonImage={Information}
        secondaryRightButtonImageStyle={
          localStyle.header.secondaryRightButtonImageStyle
        }
        rightButtonViewStyle={localStyle.header.rightButtonViewStyle}
      />
      <View style={localStyle.container}>
        <View style={localStyle.contentContainer}>
          <Text style={localStyle.headerText}>Settings</Text>
          <Card
            titleText={'Personalize your feed'}
            subTitleText={
              'Choose what you see from categories, verified users etc.'
            }
            onPress={fnOnPersonalizeFeedPress}
          />
          <Card
            titleText={'Backup your data'}
            subTitleText={'Save your preferences, lists and archives.'}
            onPress={() => {
              _backUpRestoreHelper.backUpDataToFirebase({
                onBackUpSuccess: () => {},
              });
            }}
          />
          <Card
            titleText={'Restore your data'}
            subTitleText={
              sLastBackUpTimeStamp
                ? `Restore data from (backup ${sLastBackUpTimeStamp})`
                : 'Restore data from ...'
            }
            onPress={() => {
              _backUpRestoreHelper.restoreDataFromFirebase({
                onRestoreSuccess: () => {},
              });
            }}
          />
          <RoundedButton
            testId="setting_screen_clear"
            text={'Clear all Data'}
            onPress={() => {
              _backUpRestoreHelper.clearData();
            }}
            style={localStyle.buttonStyle}
            textStyle={localStyle.buttonTextStyle}
          />
        </View>
        <View style={localStyle.bottomContainer}>
          <View style={localStyle.flexRow}>
            <Image source={Canary} style={localStyle.canaryIconStyle} />
            <Text style={localStyle.appNameText}>Canary</Text>
            <Text style={localStyle.appVersionText}>v{AppVersion}</Text>
          </View>
          <Text
            style={localStyle.madeByText}
            onPress={() => {
              Linking.openURL(Constants.PlgWorksLink);
            }}>
            Made with 🖤 by PLG Works
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = {
  screen: {
    flex: 1,
    backgroundColor: colors.White,
  },
  container: {
    justifyContent: 'space-between',
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: layoutPtToPx(20),
  },
  headerText: {
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(32),
    lineHeight: layoutPtToPx(40),
    color: colors.BlackPearl,
    marginTop: layoutPtToPx(20),
  },
  cardContainer: {
    borderWidth: 1,
    paddingHorizontal: layoutPtToPx(10),
    paddingVertical: layoutPtToPx(16),
    marginTop: layoutPtToPx(14),
    borderRadius: layoutPtToPx(8),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: colors.BlackPearl20,
  },
  cardDetailBox: {
    flexShrink: 1,
  },
  arrowStyle: {
    height: layoutPtToPx(12),
    width: layoutPtToPx(16),
    tintColor: colors.BlackPearl,
  },
  titleText: {
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(14),
    lineHeight: layoutPtToPx(18),
    color: colors.BlackPearl,
  },
  subTitleText: {
    fontFamily: fonts.InterLight,
    fontStyle: 'italic',
    fontSize: fontPtToPx(12),
    lineHeight: layoutPtToPx(15),
    color: colors.BlackPearl,
    marginTop: layoutPtToPx(3),
  },
  header: {
    rightButtonViewStyle: {
      flexDirection: 'row',
    },
    rightButtonImageStyle: {
      tintColor: colors.GoldenTainoi,
      height: layoutPtToPx(22),
      width: layoutPtToPx(22),
      marginRight: 10,
    },
    secondaryRightButtonImageStyle: {
      tintColor: colors.GoldenTainoi,
      height: layoutPtToPx(22),
      width: layoutPtToPx(22),
      marginLeft: 10,
    },
  },
  buttonStyle: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: colors.White,
    height: layoutPtToPx(50),
    borderRadius: layoutPtToPx(8),
    borderColor: colors.BitterSweet,
    borderWidth: layoutPtToPx(1),
    marginTop: layoutPtToPx(25),
  },
  buttonTextStyle: {
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(14),
    lineHeight: layoutPtToPx(18),
    color: colors.BitterSweet,
  },

  canaryIconStyle: {
    height: layoutPtToPx(24),
    width: layoutPtToPx(24),
  },
  appNameText: {
    color: colors.BlackPearl,
    fontSize: fontPtToPx(16),
    lineHeight: layoutPtToPx(20),
    fontFamily: fonts.SoraSemiBold,
    marginLeft: layoutPtToPx(4),
    alignSelf: 'center',
  },
  appVersionText: {
    color: colors.BlackPearl,
    fontSize: fontPtToPx(12),
    lineHeight: layoutPtToPx(15),
    fontFamily: fonts.InterRegular,
    marginLeft: layoutPtToPx(4),
    alignSelf: 'center',
  },
  madeByText: {
    color: colors.BlackPearl,
    fontSize: fontPtToPx(12),
    lineHeight: layoutPtToPx(17),
    fontFamily: fonts.InterSemiBold,
    marginTop: layoutPtToPx(10),
  },
  bottomContainer: {
    alignItems: 'center',
    paddingVertical: layoutPtToPx(10),
  },
  flexRow: {
    flexDirection: 'row',
  },
};
export default React.memo(SettingScreen);
