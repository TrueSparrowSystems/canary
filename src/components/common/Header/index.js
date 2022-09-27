import React, {useCallback} from 'react';
import {Image, Text, View} from 'react-native';
import {useStyleProcessor} from '../../../hooks/useStyleProcessor';
import colors from '../../../constants/colors';
import {layoutPtToPx} from '../../../utils/responsiveUI';
import {BackIcon} from '../../../assets/common';
import {useNavigation} from '@react-navigation/native';
import fonts from '../../../constants/fonts';
import {TouchableOpacity} from '@plgworks/applogger';

function Header(props) {
  const {
    enableBackButton,
    enableRightButton,
    onRightButtonClick,
    rightButtonImage,
    rightButtonImageStyle,
    enableSecondaryRightButton,
    onSecondaryRightButtonClick,
    secondaryRightButtonImage,
    secondaryRightButtonImageStyle,
    rightButtonText,
    rightButtonTextStyle,
    enableLeftButton,
    leftButtonImage,
    leftButtonText,
    onLeftButtonClick,
    leftButtonImageStyle,
    leftButtonTextStyle,
    text,
    textStyle,
    style,
    rightButtonViewStyle,
    testID = '',
  } = props;

  const navigation = useNavigation();

  const onBackPress = useCallback(() => {
    if (navigation.canGoBack) {
      navigation.goBack();
    }
  }, [navigation]);

  const localStyle = useStyleProcessor(styles, 'Header');

  return (
    <View style={style || localStyle.header}>
      <View style={localStyle.view}>
        <View style={localStyle.backButtonView}>
          {enableBackButton ? (
            <TouchableOpacity
              testID={`${testID}_header_back_icon`}
              activeOpacity={1}
              onPress={onBackPress}>
              <Image source={BackIcon} style={localStyle.backIcon} />
            </TouchableOpacity>
          ) : null}
          {enableLeftButton && (leftButtonImage || leftButtonText) ? (
            <TouchableOpacity
              testID={`${testID}_header_left_button${
                leftButtonText ? '_text_' + leftButtonText : null
              }`}
              style={localStyle.leftButtonStyle}
              activeOpacity={1}
              onPress={onLeftButtonClick}>
              {leftButtonImage ? (
                <Image
                  source={leftButtonImage}
                  style={leftButtonImageStyle || localStyle.leftIcon}
                />
              ) : null}
              {leftButtonText ? (
                <Text style={leftButtonTextStyle}>{leftButtonText}</Text>
              ) : null}
            </TouchableOpacity>
          ) : (
            <View />
          )}
        </View>
        <View style={localStyle.textView}>
          {text ? (
            <Text numberOfLines={1} style={textStyle || localStyle.textStyle}>
              {text}
            </Text>
          ) : null}
        </View>
        <View style={rightButtonViewStyle || localStyle.rightButtonView}>
          {enableRightButton && (rightButtonImage || rightButtonText) ? (
            <TouchableOpacity
              testID={`${testID}_header_right_button${
                rightButtonText ? '_text_' + rightButtonText : '_image'
              }`}
              style={localStyle.rightButtonStyle}
              activeOpacity={1}
              onPress={onRightButtonClick}>
              {rightButtonImage ? (
                <Image
                  source={rightButtonImage}
                  style={rightButtonImageStyle || localStyle.rightIcon}
                />
              ) : null}
              {rightButtonText ? (
                <Text style={rightButtonTextStyle}>{rightButtonText}</Text>
              ) : null}
            </TouchableOpacity>
          ) : (
            <View />
          )}
          {enableSecondaryRightButton && secondaryRightButtonImage ? (
            <TouchableOpacity
              testID={`${testID}_header_secondary_right_button`}
              style={localStyle.rightButtonStyle}
              activeOpacity={1}
              onPress={onSecondaryRightButtonClick}>
              {secondaryRightButtonImage ? (
                <Image
                  source={secondaryRightButtonImage}
                  style={secondaryRightButtonImageStyle || localStyle.rightIcon}
                />
              ) : null}
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
}

export default React.memo(Header);

const styles = {
  header: {
    paddingHorizontal: layoutPtToPx(20),
    height: layoutPtToPx(50),
    justifyContent: 'center',
  },
  view: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    height: layoutPtToPx(20),
    width: layoutPtToPx(20),
    tintColor: colors.GoldenTainoi,
  },
  textStyle: {
    color: colors.Black,
    fontFamily: fonts.SoraSemiBold,
  },
  leftIcon: {
    height: layoutPtToPx(25),
    width: layoutPtToPx(25),
  },
  rightIcon: {
    height: layoutPtToPx(25),
    width: layoutPtToPx(25),
  },
  leftButtonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightButtonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonView: {
    flex: 1,
    alignItems: 'flex-start',
    minWidth: layoutPtToPx(40),
  },
  textView: {
    position: 'absolute',
    zIndex: -1,
    width: '100%',
    paddingHorizontal: '15%',
    alignItems: 'center',
  },
  rightButtonView: {
    alignItems: 'center',
    flexDirection: 'row',
  },
};
