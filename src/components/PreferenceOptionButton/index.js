import React, {useCallback, useEffect, useState} from 'react';
import {View} from 'react-native';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import colors from '../../constants/colors';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import RoundedButton from '../common/RoundedButton';
import fonts from '../../constants/fonts';

const PreferenceOptionButton = ({
  id,
  style,
  textStyle,
  text,
  onPress,
  isSelected,
  icon,
}) => {
  const localStyle = useStyleProcessor(styles, 'PreferenceOptionButton');
  const [selected, setSelected] = useState(isSelected ? isSelected : false);

  const localButtonStyle = style || localStyle.preferenceButton;

  const buttonBorderColor = selected ? colors.GoldenTainoi : colors.BlackPearl;
  const buttonBackgroundColor = selected
    ? colors.GoldenTainoi
    : colors.Transparent;

  const buttonStyle = {
    ...localButtonStyle,
    borderColor: buttonBorderColor,
    backgroundColor: buttonBackgroundColor,
  };

  useEffect(() => {
    if (isSelected) {
      setSelected(true);
    } else {
      setSelected(false);
    }
  }, [isSelected]);

  const onSelect = useCallback(() => {
    onPress?.(id, !selected);
  }, [id, onPress, selected]);

  return (
    <View>
      <RoundedButton
        testId={`preference_option_${text}`}
        text={text}
        leftImage={icon}
        leftImageStyle={localStyle.iconStyle}
        style={buttonStyle}
        textStyle={textStyle || localStyle.preferenceButtonText}
        onPress={onSelect}
        underlayColor={colors.GoldenTainoi20}
      />
    </View>
  );
};

export default React.memo(PreferenceOptionButton);

const styles = {
  preferenceButton: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: 'auto',
    height: layoutPtToPx(30),
    borderRadius: layoutPtToPx(30),
    borderWidth: layoutPtToPx(1),
    paddingHorizontal: layoutPtToPx(8),
    paddingVertical: layoutPtToPx(5),
    marginVertical: layoutPtToPx(5),
    marginRight: layoutPtToPx(10),
  },
  preferenceButtonText: {
    marginRight: -2,
    fontFamily: fonts.InterSemiBold,
    fontSize: fontPtToPx(12),
    lineHeight: fontPtToPx(15),
    alignItems: 'center',
    color: colors.BlackPearl,
  },
  iconStyle: {
    height: layoutPtToPx(12),
    width: layoutPtToPx(12),
    marginRight: layoutPtToPx(8),
  },
};
