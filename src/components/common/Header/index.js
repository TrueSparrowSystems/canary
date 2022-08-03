import React, {useCallback} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {useStyleProcessor} from '../../../hooks/useStyleProcessor';
import colors from '../../../constants/colors';
import {layoutPtToPx} from '../../../utils/responsiveUI';
import {BackIcon} from '../../../assets/common';
import {useNavigation} from '@react-navigation/native';

function Header(props) {
  const {
    enableBackButton,
    enableRightButton,
    onRightButtonClick,
    rightButtonImage,
    rightIconStyle,
    rightButtonText,
    rightButtonTextStyle,
    text,
    textStyle,
    style,
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
      <View style={localStyle.backButtonView}>
        {enableBackButton ? (
          <TouchableOpacity activeOpacity={1} onPress={onBackPress}>
            <Image source={BackIcon} style={localStyle.backIcon} />
          </TouchableOpacity>
        ) : null}
      </View>
      <View style={localStyle.textView}>
        {text ? (
          <Text numberOfLines={1} style={textStyle || localStyle.textStyle}>
            {text}
          </Text>
        ) : null}
      </View>
      <View style={localStyle.rightButtonView}>
        {enableRightButton && (rightButtonImage || rightButtonText) ? (
          <TouchableOpacity
            style={localStyle.rightButtonStyle}
            activeOpacity={1}
            onPress={onRightButtonClick}>
            {rightButtonImage ? (
              <Image
                source={rightButtonImage}
                style={rightIconStyle || localStyle.rightIcon}
              />
            ) : null}
            {rightButtonText ? (
              <Text style={rightButtonTextStyle}>{rightButtonText}</Text>
            ) : null}
          </TouchableOpacity>
        ) : (
          <View />
        )}
      </View>
    </View>
  );
}

export default React.memo(Header);

const styles = {
  header: {
    marginHorizontal: layoutPtToPx(20),
    height: layoutPtToPx(50),
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
  },
  rightIcon: {
    height: layoutPtToPx(25),
    width: layoutPtToPx(25),
  },
  rightButtonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonView: {
    flexShrink: 1,
    alignItems: 'flex-start',
    minWidth: layoutPtToPx(40),
  },
  textView: {
    flexGrow: 1,
    alignItems: 'center',
    maxWidth: '70%',
  },
  rightButtonView: {
    flexShrink: 1,
    alignItems: 'flex-end',
  },
};
