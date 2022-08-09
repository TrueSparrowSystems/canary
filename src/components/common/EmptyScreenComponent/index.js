import React from 'react';
import {View, Image, Text} from 'react-native';
import {AddIcon} from '../../../assets/common';
import colors, {getColorWithOpacity} from '../../../constants/colors';
import fonts from '../../../constants/fonts';
import {useStyleProcessor} from '../../../hooks/useStyleProcessor';
import {fontPtToPx, layoutPtToPx} from '../../../utils/responsiveUI';
import RoundedButton from '../RoundedButton';

function EmptyScreenComponent(props) {
  const {
    emptyImage,
    descriptionText,
    descriptionTextStyle,
    buttonText,
    buttonImage,
    buttonImageStyle,
    onButtonPress,
  } = props;
  const localStyle = useStyleProcessor(styles, 'EmptyScreenComponent');

  return (
    <View style={localStyle.emptyViewStyle}>
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
          style={localStyle.createButton}
          text={buttonText}
          textStyle={localStyle.createButtonText}
          leftImage={buttonImage || AddIcon}
          leftImageStyle={buttonImageStyle || localStyle.addIconStyle}
          onPress={onButtonPress}
          underlayColor={colors.GoldenTainoi80}
        />
      ) : null}
    </View>
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
    letterSpacing: 1.2,
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
    lineHeight: layoutPtToPx(20),
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
  },
};

export default React.memo(EmptyScreenComponent);
