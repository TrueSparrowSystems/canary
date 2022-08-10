import {useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {Image, Text, View} from 'react-native';
import {Canary, rightArrowIcon} from '../../assets/common';
import RoundedButton from '../../components/common/RoundedButton';
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import ScreenName from '../../constants/ScreenName';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
function LandingScreen() {
  const localStyle = useStyleProcessor(style, 'LandingScreen');
  const navigation = useNavigation();

  const onContinuePress = useCallback(() => {
    navigation.navigate(ScreenName.PreferenceScreen);
  }, [navigation]);

  return (
    <View style={localStyle.container}>
      <View style={localStyle.contentContainer}>
        <View style={localStyle.flexRow}>
          <Image source={Canary} style={localStyle.iconStyle} />
          <Text style={localStyle.titleText}>Welcome to Canary</Text>
        </View>
        <View style={localStyle.textBox}>
          <Text style={localStyle.subText}>
            A space where you can discover content from twitter — browse topics,
            save tweets, and stay up-to-date from your favorite creators!
          </Text>

          <Text style={localStyle.noteText}>
            PS: You don’t need an account for anything, and you’re not tracked
            😉
          </Text>
        </View>
        <View style={localStyle.continueButtonContainer}>
          <RoundedButton
            style={localStyle.continueButton}
            text="Continue"
            textStyle={localStyle.continueButtonText}
            onPress={onContinuePress}
            rightImage={rightArrowIcon}
            rightImageStyle={localStyle.continueButtonIcon}
            underlayColor={colors.GoldenTainoi80}
          />
        </View>
      </View>
    </View>
  );
}

const style = {
  container: {
    backgroundColor: colors.White,
    justifyContent: 'center',
    flex: 1,
  },
  contentContainer: {
    padding: layoutPtToPx(20),
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconStyle: {
    height: layoutPtToPx(40),
    width: layoutPtToPx(40),
  },
  titleText: {
    color: colors.BlackPearl,
    fontSize: fontPtToPx(28),
    lineHeight: layoutPtToPx(40),
    fontFamily: fonts.SoraSemiBold,
    marginLeft: layoutPtToPx(8),
    textAlign: 'center',
  },
  textBox: {
    marginVertical: layoutPtToPx(20),
  },
  subText: {
    color: colors.BlackPearl,
    fontSize: fontPtToPx(16),
    lineHeight: layoutPtToPx(24),
    marginTop: layoutPtToPx(4),
    fontFamily: fonts.InterMedium,
    textAlign: 'center',
  },
  noteText: {
    marginTop: layoutPtToPx(24),
    color: colors.BlackPearl,
    fontSize: fontPtToPx(16),
    lineHeight: layoutPtToPx(24),
    fontFamily: fonts.InterRegular,
    fontStyle: 'italic',
    textAlign: 'center',
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
    marginHorizontal: layoutPtToPx(5),
    fontSize: fontPtToPx(14),
    justifyContent: 'center',
    alignItems: 'center',
    color: colors.BlackPearl,
    fontFamily: fonts.SoraSemiBold,
    textTransform: 'capitalize',
  },
  continueButtonIcon: {
    height: layoutPtToPx(12),
    width: layoutPtToPx(16.5),
  },
};
export default React.memo(LandingScreen);
