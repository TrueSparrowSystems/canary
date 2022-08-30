import {TouchableOpacity} from '@plgworks/applogger';
import React, {useState, useMemo, useEffect, useCallback} from 'react';
import {View, Image, Text} from 'react-native';
import {CheckMarkIcon} from '../../../assets/common';
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
  testID = '',
}) {
  const localStyles = useStyleProcessor(styles, 'CheckBox');

  const [selected, setSelected] = useState(value);

  const localContainerStyle = style || localStyles.container;
  const localUncheckedBoxContainerStyle =
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
      height: layoutPtToPx(7),
      width: layoutPtToPx(10),
      opacity: selected ? 1 : 0,
    }),
    [selected],
  );

  return (
    <TouchableOpacity
      testID={`check_box_id_${testID}`}
      activeOpacity={1}
      disabled={disabled}
      style={localContainerStyle}
      onPress={onButtonPress}>
      <View
        style={
          selected
            ? localStyles.imageContainer
            : localUncheckedBoxContainerStyle
        }>
        <Image source={CheckMarkIcon} style={imageStyle} />
      </View>
      {text ? (
        <Text style={textStyle || localStyles.textStyle}>{text}</Text>
      ) : null}
    </TouchableOpacity>
  );
}
const styles = {
  container: {
    height: layoutPtToPx(17),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uncheckedBox: {
    borderColor: colors.Black,
    borderWidth: 1,
    borderRadius: layoutPtToPx(9),
    height: layoutPtToPx(17),
    width: layoutPtToPx(17),
  },
  imageContainer: {
    borderWidth: 1,
    borderColor: colors.GoldenTainoi,
    height: layoutPtToPx(17),
    width: layoutPtToPx(17),
    borderRadius: layoutPtToPx(9),
    backgroundColor: colors.GoldenTainoi,
    alignItems: 'center',
    justifyContent: 'center',
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
