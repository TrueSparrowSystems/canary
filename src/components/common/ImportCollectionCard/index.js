import React, {useMemo} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import useImportCollectionCardData from './useImportCollectionCardData';
import {BinIcon} from '../../../assets/common';
import {fontPtToPx, layoutPtToPx} from '../../../utils/responsiveUI';
import fonts from '../../../constants/fonts';
import {useStyleProcessor} from '../../../hooks/useStyleProcessor';
import {getRandomColorCombination} from '../../../utils/RandomColorUtil';

function ImportCollectionCard(props) {
  const {collectionName, tweetIds, onArchiveRemove, onArchivePress} = props;
  const localStyle = useStyleProcessor(styles, 'ImportCollectionCard');

  const {} = useImportCollectionCardData(tweetIds, collectionName);
  const colorSchemeStyle = useMemo(() => {
    const colorScheme = getRandomColorCombination();
    return {
      cardStyle: [
        localStyle.cardStyle,
        {backgroundColor: colorScheme?.backgroundColor},
      ],
      textStyle: [localStyle.textStyle, {color: colorScheme?.textColor}],
      tweetCountTextStyle: [
        localStyle.tweetCountTextStyle,
        {color: colorScheme?.textColor},
      ],
    };
  }, [
    localStyle.cardStyle,
    localStyle.textStyle,
    localStyle.tweetCountTextStyle,
  ]);

  return (
    <TouchableOpacity
      onPress={onArchivePress}
      style={colorSchemeStyle.cardStyle}>
      <View style={localStyle.optionsView}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={localStyle.binContainer}
          onPress={onArchiveRemove}>
          <Image source={BinIcon} style={localStyle.binIconStyle} />
        </TouchableOpacity>
      </View>

      <Text numberOfLines={3} style={colorSchemeStyle.textStyle}>
        {collectionName}
      </Text>
      {tweetIds.length > 0 ? (
        <Text numberOfLines={1} style={colorSchemeStyle.tweetCountTextStyle}>
          {tweetIds.length} {tweetIds.length > 1 ? 'tweets' : 'tweet'}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = {
  cardStyle: {
    height: layoutPtToPx(160),
    width: layoutPtToPx(160),
    borderRadius: layoutPtToPx(11),
    justifyContent: 'flex-end',
    marginHorizontal: layoutPtToPx(10),
    marginVertical: layoutPtToPx(20),
  },
  textStyle: {
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(24),
    lineHeight: layoutPtToPx(30),
    padding: layoutPtToPx(8),
  },
  tweetCountTextStyle: {
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(14),
    lineHeight: layoutPtToPx(18),
    padding: layoutPtToPx(8),
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

export default React.memo(ImportCollectionCard);
