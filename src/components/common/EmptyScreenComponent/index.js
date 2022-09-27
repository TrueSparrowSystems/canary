import React from 'react';
import {Image, Text} from 'react-native';
import colors, {getColorWithOpacity} from '../../../constants/colors';
import fonts from '../../../constants/fonts';
import {useStyleProcessor} from '../../../hooks/useStyleProcessor';
import {fontPtToPx, layoutPtToPx} from '../../../utils/responsiveUI';
import RoundedButton from '../RoundedButton';
import * as Animatable from 'react-native-animatable';

function EmptyScreenComponent(props) {
  const {
    emptyImage,
    descriptionText,
    descriptionTextStyle,
    buttonText,
    buttonImage,
    buttonImageStyle,
    onButtonPress,
    buttonStyle,
  } = props;
  const localStyle = useStyleProcessor(styles, 'EmptyScreenComponent');

  return (
    <Animatable.View animation="fadeIn" style={localStyle.emptyViewStyle}>
      {emptyImage ? (
        <Image source={emptyImage} style={localStyle.emptyImageStyle} />
      ) : null}
      {descriptionText ? (
        <Text style={descriptionTextStyle || localStyle.descriptionTextStyle}>
          {descriptionText}
        </Text>
      ) : null}
      {buttonText ? (
        <RoundedButton
          testID={`empty_screen_component_${buttonText}`}
          style={buttonStyle || localStyle.createButton}
          text={buttonText}
          textStyle={localStyle.createButtonText}
          leftImage={buttonImage ? buttonImage : null}
          leftImageStyle={buttonImageStyle || localStyle.addIconStyle}
          onPress={onButtonPress}
          underlayColor={colors.GoldenTainoi80}
        />
      ) : null}
    </Animatable.View>
  );
}

const styles = {
  createButton: {
    marginTop: layoutPtToPx(20),
    backgroundColor: colors.GoldenTainoi,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: layoutPtToPx(40),
    borderRadius: layoutPtToPx(25),
  },
  createButtonText: {
    marginHorizontal: layoutPtToPx(5),
    fontSize: fontPtToPx(14),
    justifyContent: 'center',
    alignItems: 'center',
    color: colors.BlackPearl,
    fontFamily: fonts.SoraSemiBold,
  },
  addIconStyle: {
    height: layoutPtToPx(18),
    width: layoutPtToPx(18),
  },
  descriptionTextStyle: {
    fontFamily: fonts.SoraSemiBold,
    textAlign: 'center',
    fontSize: fontPtToPx(16),
    lineHeight: layoutPtToPx(21),
    marginTop: layoutPtToPx(20),
    color: getColorWithOpacity(colors.BlackPearl, 0.7),
  },
  emptyImageStyle: {
    height: layoutPtToPx(124),
    width: layoutPtToPx(124),
  },
  emptyViewStyle: {
    marginHorizontal: layoutPtToPx(20),
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: layoutPtToPx(50),
    tablet: {
      alignSelf: 'center',
      width: '60%',
      landscape: {
        width: '50%',
      },
    },
  },
};

export default React.memo(EmptyScreenComponent);
