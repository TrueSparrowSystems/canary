import React from 'react';
import {Text, View, Image} from 'react-native';
import {CrossIcon} from '../../../assets/common';
import colors, {getColorWithOpacity} from '../../../constants/colors';
import fonts from '../../../constants/fonts';
import {useStyleProcessor} from '../../../hooks/useStyleProcessor';
import {fontPtToPx, layoutPtToPx} from '../../../utils/responsiveUI';
import RoundedButton from '../RoundedButton';

function Banner(props) {
  const {
    headerImage,
    headerImageStyle,
    headerText,
    descriptionText,
    style,
    textStyle,
    onRemovePromotionPress,
    testID = '',
  } = props;
  const localStyle = useStyleProcessor(styles, 'Banner');

  return (
    <View style={style || localStyle.banner}>
      <View style={localStyle.headerContainer}>
        <View style={localStyle.headText}>
          <Image source={headerImage} style={headerImageStyle} />
          <Text style={textStyle || localStyle.flexShrink}>{headerText}</Text>
        </View>
        <RoundedButton
          testId={`${testID}_banner_cross`}
          style={localStyle.crossButton}
          leftImage={CrossIcon}
          leftImageStyle={localStyle.crossIconStyle}
          onPress={onRemovePromotionPress}
          underlayColor={colors.White}
        />
      </View>
      <Text style={localStyle.descriptionTextStyle}>{descriptionText}</Text>
    </View>
  );
}

const styles = {
  banner: {
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: layoutPtToPx(20),
    borderBottomWidth: 1,
    borderBottomColor: getColorWithOpacity(colors.BlackPearl, 0.5),
    paddingVertical: layoutPtToPx(12),
  },
  crossButton: {
    flexGrow: 1,
    alignItems: 'flex-end',
    width: 'auto',
    borderRadius: layoutPtToPx(25),
    paddingHorizontal: layoutPtToPx(10),
  },
  crossIconStyle: {
    height: layoutPtToPx(20),
    width: layoutPtToPx(20),
  },
  flexShrink: {
    flexShrink: 1,
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(12),
    lineHeight: layoutPtToPx(15),
    color: colors.Black,
  },
  headerContainer: {
    flexDirection: 'row',
    marginBottom: layoutPtToPx(10),
  },
  headText: {
    flexDirection: 'row',
  },
  descriptionTextStyle: {
    fontFamily: fonts.InterRegular,
    fontSize: fontPtToPx(12),
    lineHeight: layoutPtToPx(15),
    color: colors.Black,
  },
};

export default React.memo(Banner);
