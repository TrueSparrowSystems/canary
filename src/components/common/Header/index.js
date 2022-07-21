import React, {useCallback} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {useStyleProcessor} from '../../../hooks/useStyleProcessor';
import colors from '../../../utils/colors';
import {layoutPtToPx} from '../../../utils/responsiveUI';
import {BackIcon} from '../../../assets/common';
import {useNavigation} from '@react-navigation/native';

function Header(props) {
  const {
    enableBackButton,
    enableRightButton,
    onRightButtonClick,
    rightButtonImage,
    text,
    textStyle,
  } = props;

  const navigation = useNavigation();

  const onBackPress = useCallback(() => {
    if (navigation.canGoBack) {
      navigation.goBack();
    }
  }, [navigation]);

  const localStyle = useStyleProcessor(styles, 'Header');

  return (
    <View style={localStyle.header}>
      {enableBackButton ? (
        <TouchableOpacity activeOpacity={1} onPress={onBackPress}>
          <Image source={BackIcon} style={localStyle.backIcon} />
        </TouchableOpacity>
      ) : null}
      {text ? <Text style={textStyle}>{text}</Text> : null}
      {enableRightButton && rightButtonImage ? (
        <TouchableOpacity activeOpacity={1} onPress={onRightButtonClick}>
          <Image source={rightButtonImage} style={localStyle.rightIcon} />
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
    marginHorizontal: 20,
    height: layoutPtToPx(50),
    flexDirection: 'row',
    justifyContent: 'space-between',

    alignItems: 'center',
  },
  backIcon: {
    height: layoutPtToPx(20),
    width: layoutPtToPx(20),
    tintColor: colors.DodgerBlue,
  },
  rightIcon: {
    height: layoutPtToPx(25),
    width: layoutPtToPx(25),
  },
};
