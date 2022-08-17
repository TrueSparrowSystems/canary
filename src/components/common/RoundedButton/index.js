import React from 'react';
import {Text, TouchableHighlight, View, Image} from 'react-native';
import {useStyleProcessor} from '../../../hooks/useStyleProcessor';
import {fontPtToPx, layoutPtToPx} from '../../../utils/responsiveUI';
import Colors from '../../../constants/colors';

/**
 * @param {Function} onPress Callback function which is called when button is pressed.
 * @param {Boolean} disabled Boolean flag which show the disabled view for button.
 * @param {String} text Text for the button.
 * @param {String} leftImage Image for the button.
 * @param {Object} style Object containing info about styling of container.
 * @param {Object} textStyle Object containing info about styling of button text.
 * @param {Object} leftImageStyle Object containing info about styling of image.
 * @param {String} underlayColor Color to be displayed when button is pressed.
 * @returns {JSX} Rounded Button View.
 */
function RoundedButton({
  onPress,
  disabled,
  shouldReduceOpacityWhenDisabled = true,
  text,
  leftImage,
  style,
  textStyle,
  leftImageStyle,
  underlayColor,
  rightImage,
  rightImageStyle,
}) {
  const localStyle = useStyleProcessor(styles, 'RoundedButton');
  const containerStyle = style || localStyle.container;
  return (
    <TouchableHighlight
      underlayColor={underlayColor || Colors.Mandy30}
      disabled={disabled}
      style={[
        containerStyle,
        disabled && shouldReduceOpacityWhenDisabled ? {opacity: 0.5} : {},
      ]}
      onPress={onPress}>
      <View style={localStyle.buttonContainer}>
        {leftImage ? (
          <Image
            resizeMode={'contain'}
            style={leftImageStyle || localStyle.btnLeftImage}
            source={leftImage}
          />
        ) : null}
        {text ? (
          <Text style={textStyle || localStyle.btnText}>{text}</Text>
        ) : null}
        {rightImage ? (
          <Image
            resizeMode={'contain'}
            style={rightImageStyle || localStyle.btnRightImage}
            source={rightImage}
          />
        ) : null}
      </View>
    </TouchableHighlight>
  );
}

const styles = {
  container: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: 'auto',
    backgroundColor: Colors.White,
    height: layoutPtToPx(30),
    borderRadius: layoutPtToPx(30),
    borderColor: Colors.Mandy,
    borderWidth: layoutPtToPx(1),
  },
  btnText: {
    textTransform: 'uppercase',
    fontSize: fontPtToPx(10),
    justifyContent: 'center',
    alignItems: 'center',
    color: Colors.WildWaterMelon,
  },
  btnLeftImage: {
    marginRight: layoutPtToPx(2),
  },
  btnRightImage: {
    marginLeft: layoutPtToPx(2),
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default React.memo(RoundedButton);
