import React, {useState, useMemo, useEffect, useCallback} from 'react';
import {View, Image, TouchableOpacity, Text} from 'react-native';
import {CheckBoxImage} from '../../../assets/common';
import colors from '../../../constants/colors';
import fonts from '../../../constants/fonts';
import {useStyleProcessor} from '../../../hooks/useStyleProcessor';
import {fontPtToPx, layoutPtToPx} from '../../../utils/responsiveUI';

function CheckBox({
  style,
  disabled,
  value,
  onValueChange,
  uncheckedBoxContainerStyle,
  text,
  textStyle,
  checkedBoxImage,
}) {
  const localStyles = useStyleProcessor(styles, 'CheckBox');

  const checkedImage = useMemo(
    () => checkedBoxImage || CheckBoxImage,
    [checkedBoxImage],
  );

  const [selected, setSelected] = useState(value);

  const localContainerStyle = style || localStyles.container;
  const localUnheckedBoxContainerStyle =
    uncheckedBoxContainerStyle || localStyles.uncheckedBox;

  const onButtonPress = useCallback(() => {
    setSelected(prevValue => !prevValue);
    onValueChange?.(!selected);
  }, [onValueChange, selected]);

  useEffect(() => {
    setSelected(value);
  }, [value]);

  const imageStyle = useMemo(
    () => ({
      height: layoutPtToPx(14),
      width: layoutPtToPx(14),
      opacity: selected ? 1 : 0,
    }),
    [selected],
  );

  return (
    <TouchableOpacity
      activeOpacity={1}
      disabled={disabled}
      style={localContainerStyle}
      onPress={onButtonPress}>
      <View
        style={
          selected ? localStyles.imageContainer : localUnheckedBoxContainerStyle
        }>
        <Image style={imageStyle} source={checkedImage} />
      </View>
      {text ? (
        <Text style={textStyle || localStyles.textStyle}>{text}</Text>
      ) : null}
    </TouchableOpacity>
  );
}
const styles = {
  container: {
    height: layoutPtToPx(16),
    margin: layoutPtToPx(2),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uncheckedBox: {
    borderColor: colors.SherpaBlue,
    borderWidth: 1,
    borderRadius: 2,
    height: layoutPtToPx(14),
    width: layoutPtToPx(14),
  },
  imageContainer: {
    height: layoutPtToPx(14),
    width: layoutPtToPx(14),
  },
  textStyle: {
    marginLeft: layoutPtToPx(4),
    fontSize: fontPtToPx(13),
    lineHeight: layoutPtToPx(16),
    fontFamily: fonts.InterRegular,
    color: colors.BlackPearl,
  },
};

export default React.memo(CheckBox);
