import React, {useMemo, useRef} from 'react';
import {Text, View, Image, TouchableOpacity} from 'react-native';
import {BinIcon, ListIcon} from '../../../assets/common';
import colors, {getColorWithOpacity} from '../../../constants/colors';
import fonts from '../../../constants/fonts';
import {useStyleProcessor} from '../../../hooks/useStyleProcessor';
import {getRandomColorCombination} from '../../../utils/RandomColorUtil';
import {fontPtToPx, layoutPtToPx} from '../../../utils/responsiveUI';
import {getInitialsFromName} from '../../../utils/TextUtils';
import useMiniListCardData from './useMiniListCardData';

function MiniListCard(props) {
  const {listName, onListPress, onListRemove, isSelected = false} = props;
  const localStyle = useStyleProcessor(styles, 'MiniListCard');

  const {fnGetDescriptionText} = useMiniListCardData(props);

  const colorCombination = useRef(getRandomColorCombination());

  const listIntials = useMemo(() => getInitialsFromName(listName), [listName]);
  const listIconStyle = useMemo(() => {
    return {
      backgroundStyle: [
        localStyle.listIconStyle,
        {backgroundColor: colorCombination.current?.backgroundColor},
      ],
      textStyle: [
        localStyle.listIconTextStyle,
        {color: colorCombination.current?.textColor},
      ],
      listIcon: [
        localStyle.listImageStyle,
        {
          tintColor: colorCombination.current?.textColor,
        },
      ],
      containerStyle: [
        localStyle.container,
        {
          backgroundColor: getColorWithOpacity(colors.GoldenTainoi, 0.3),
          borderColor: isSelected ? colors.Niagara : colors.Transparent,
        },
      ],
    };
  }, [
    isSelected,
    localStyle.container,
    localStyle.listIconStyle,
    localStyle.listIconTextStyle,
    localStyle.listImageStyle,
  ]);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onListPress}
      style={listIconStyle.containerStyle}>
      <View style={localStyle.optionsView}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={localStyle.binContainer}
          onPress={onListRemove}>
          <Image source={BinIcon} style={localStyle.binIconStyle} />
        </TouchableOpacity>
      </View>
      <View style={localStyle.cardDetailContainer}>
        <View style={listIconStyle.backgroundStyle}>
          {listIntials?.length === 0 ? (
            <Image source={ListIcon} style={listIconStyle.listIcon} />
          ) : (
            <Text style={listIconStyle.textStyle}>
              {listIntials?.substring(0, 2)}
            </Text>
          )}
        </View>
        <View style={localStyle.listNameContainer}>
          <Text style={localStyle.listNameStyle}>{listName}</Text>
          <Text style={localStyle.descriptionTextStyle} numberOfLines={1}>
            {fnGetDescriptionText()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default React.memo(MiniListCard);

const styles = {
  container: {
    width: layoutPtToPx(200),
    marginVertical: layoutPtToPx(20),
    marginHorizontal: layoutPtToPx(10),
    borderRadius: layoutPtToPx(12),
    justifyContent: 'center',
    paddingLeft: layoutPtToPx(12),
    paddingRight: layoutPtToPx(20),
    paddingVertical: layoutPtToPx(8),
    borderWidth: 3,
  },
  cardDetailContainer: {
    flexDirection: 'row',
  },
  listIconStyle: {
    height: layoutPtToPx(40),
    width: layoutPtToPx(40),
    borderRadius: layoutPtToPx(20),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: layoutPtToPx(8),
  },
  listIconTextStyle: {
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(16),
    lineHeight: layoutPtToPx(20),
  },
  listNameContainer: {width: '80%'},
  listNameStyle: {
    color: colors.Black,
    fontFamily: fonts.InterSemiBold,
    fontSize: fontPtToPx(14),
    maxHeight: layoutPtToPx(22),
  },
  descriptionTextStyle: {
    color: colors.BlackPearl,
    fontFamily: fonts.InterLight,
    fontSize: fontPtToPx(12),
    maxHeight: layoutPtToPx(20),
    marginTop: layoutPtToPx(3),
    fontStyle: 'italic',
  },
  listImageStyle: {
    height: layoutPtToPx(20),
    width: layoutPtToPx(20),
  },
  optionsView: {
    zIndex: 2,
    position: 'absolute',
    right: layoutPtToPx(-8),
    top: layoutPtToPx(-8),
  },
  binContainer: {
    height: layoutPtToPx(40),
    width: layoutPtToPx(40),
    zIndex: 2,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  binIconStyle: {
    height: layoutPtToPx(24),
    width: layoutPtToPx(24),
  },
};
