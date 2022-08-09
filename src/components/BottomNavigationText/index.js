import React from 'react';

import {Text} from 'react-native';
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';

/**
 * @param {Object} style Object containing style info for the component.
 * @param {String} text Text to be displayed.
 * @param {Boolean} focused Boolean flag to indicated if screen is active or not.
 */
const BottomNavigationText = ({style, focused, text}) => {
  const localStyles = useStyleProcessor(styles, 'BottomNavigationText');
  return (
    <Text
      style={[
        style || localStyles.text,
        focused ? {} : localStyles.inactiveText,
      ]}>
      {text}
    </Text>
  );
};

const styles = {
  text: {
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(10),
    marginBottom: layoutPtToPx(10),
    color: colors.BlackPearl,
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  inactiveText: {
    fontFamily: fonts.SoraRegular,
    color: colors.BlackPearl50,
  },
};

export default React.memo(BottomNavigationText);
