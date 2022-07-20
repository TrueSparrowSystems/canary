import React from 'react';
import {Text, TouchableHighlight, View, Image} from 'react-native';
import {useStyleProcessor} from '../../../hooks/useStyleProcessor';
import {fontPtToPx, layoutPtToPx} from '../../../utils/responsiveUI';
import Colors from '../../../utils/colors';

/**
 * @param {Function} onPress Callback function which is called when button is pressed.
 * @param {Boolean} disabled Boolean flag which show the disabled view for button.
 * @param {String} text Text for the button.
 * @param {String} image Image for the button.
 * @param {Object} style Object containing info about styling of container.
 * @param {Object} textStyle Object containing info about styling of button text.
 * @param {Object} imageStyle Object containing info about styling of image.
 * @param {String} underlayColor Color to be displayed when button is pressed.
 * @returns {JSX} Rounded Button View.
 */
function RoundedButton({
  onPress,
  disabled,
  text,
  image,
  style,
  textStyle,
  imageStyle,
  underlayColor,
}) {
  const localStyle = useStyleProcessor(styles, 'RoundedButton');
  const containerStyle = style || localStyle.container;
  return (
    <TouchableHighlight
      underlayColor={underlayColor || Colors.Mandy30}
      disabled={disabled}
      style={[containerStyle, disabled ? {opacity: 0.5} : {}]}
      onPress={onPress}>
      <View style={localStyle.buttonContainer}>
        {image ? (
          <Image
            resizeMode={'contain'}
            style={imageStyle || localStyle.btnImage}
            source={image}
          />
        ) : null}
        {text ? (
          <Text style={textStyle || localStyle.btnText}>{text}</Text>
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
    // fontFamily: 'OpenSans-SemiBold',
    fontSize: fontPtToPx(10),
    justifyContent: 'center',
    alignItems: 'center',
    letterSpacing: 2,
    color: Colors.WildWaterMelon,
  },
  btnImage: {
    marginRight: layoutPtToPx(2),
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default React.memo(RoundedButton);
