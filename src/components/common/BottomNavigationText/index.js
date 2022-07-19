import React from 'react';
import isEqual from 'lodash/isEqual';
import {useStyleProcessor} from '../../../hooks/useStyleProcessor';
import {Text} from 'react-native';
import colors from '../../../utils/colors';

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
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 10,
    letterSpacing: 1.6,
    marginBottom: 10,
    color: colors.Mandy,
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  inactiveText: {
    fontFamily: 'OpenSans-Regular',
    color: colors.DodgerBlue,
  },
};

const areEqual = (prevProps, nextProps) => {
  return isEqual(prevProps, nextProps);
};

export default React.memo(BottomNavigationText, areEqual);
