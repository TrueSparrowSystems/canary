import React, {useCallback, useEffect, useState} from 'react';
import {View} from 'react-native';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import colors from '../../utils/colors';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import RoundedButton from '../common/RoundedButton';

const PreferenceOptionButton = ({
  id,
  style,
  textStyle,
  text,
  onPress,
  isSelected,
}) => {
  const localStyle = useStyleProcessor(styles, 'PreferenceOptionButton');
  const [selected, setSelected] = useState(isSelected ? isSelected : false);

  const localButtonStyle = style || localStyle.preferenceButton;
  const localButtonTextStyle = textStyle || localStyle.preferenceButtonText;

  const buttonBorderColor = colors.DodgerBlue;
  const buttonBackgroundColor = selected ? colors.DodgerBlue : colors.White;
  const buttonTextColor = selected ? colors.White : colors.DodgerBlue;

  const buttonStyle = {
    ...localButtonStyle,
    borderColor: buttonBorderColor,
    backgroundColor: buttonBackgroundColor,
  };

  const buttonTextStyle = {...localButtonTextStyle, color: buttonTextColor};

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
        text={text}
        style={buttonStyle}
        textStyle={buttonTextStyle}
        onPress={onSelect}
        underlayColor={colors.Gothic20}
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
    marginHorizontal: layoutPtToPx(5),
  },
  preferenceButtonText: {
    marginRight: -2,
    textTransform: 'uppercase',
    // fontFamily: 'OpenSans-SemiBold',
    fontSize: fontPtToPx(10),
    lineHeight: fontPtToPx(14),
    alignItems: 'center',
    letterSpacing: 0.8,
    color: colors.SherpaBlue70,
  },
};
