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
    rightButtonImageStyle,
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
      {enableBackButton ? (
        <TouchableOpacity activeOpacity={1} onPress={onBackPress}>
          <Image source={BackIcon} style={localStyle.backIcon} />
        </TouchableOpacity>
      ) : (
        <View />
      )}
      {text ? (
        <Text style={textStyle || localStyle.textStyle}>{text}</Text>
      ) : null}
      {enableRightButton && (rightButtonImage || rightButtonText) ? (
        <TouchableOpacity activeOpacity={1} onPress={onRightButtonClick}>
          <View style={localStyle.rightContainerStyle}>
            {rightButtonImage ? (
              <Image
                source={rightButtonImage}
                style={rightButtonImageStyle || localStyle.rightIcon}
              />
            ) : null}
            {rightButtonText ? (
              <Text style={rightButtonTextStyle}>{rightButtonText}</Text>
            ) : null}
          </View>
        </TouchableOpacity>
      ) : (
        <View />
      )}
    </View>
  );
}

export default React.memo(Header);

const styles = {
  header: {
    marginHorizontal: layoutPtToPx(20),
    height: layoutPtToPx(50),
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  rightContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
};
