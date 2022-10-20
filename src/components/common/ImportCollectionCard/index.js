import React, {useMemo, useRef} from 'react';
import {Text, View} from 'react-native';
import Image from 'react-native-fast-image';
import {BinIcon} from '../../../assets/common';
import {fontPtToPx, layoutPtToPx} from '../../../utils/responsiveUI';
import fonts from '../../../constants/fonts';
import {useStyleProcessor} from '../../../hooks/useStyleProcessor';
import {getRandomColorCombination} from '../../../utils/RandomColorUtil';
import colors from '../../../constants/colors';
import {TouchableOpacity} from '@plgworks/applogger';

function ImportCollectionCard(props) {
  const {
    collectionName,
    tweetIds,
    onArchiveRemove,
    onArchivePress,
    isSelected,
  } = props;
  const localStyle = useStyleProcessor(styles, 'ImportCollectionCard');

  const colorCombination = useRef(getRandomColorCombination());

  const colorSchemeStyle = useMemo(() => {
    return {
      cardStyle: [
        localStyle.cardStyle,
        {backgroundColor: colorCombination.current?.backgroundColor},
        {borderColor: isSelected ? colors.Niagara : colors.Transparent},
      ],
      textStyle: [
        localStyle.textStyle,
        {color: colorCombination.current?.textColor},
      ],
      tweetCountTextStyle: [
        localStyle.tweetCountTextStyle,
        {color: colorCombination.current?.textColor},
      ],
    };
  }, [
    isSelected,
    localStyle.cardStyle,
    localStyle.textStyle,
    localStyle.tweetCountTextStyle,
  ]);

  return (
    <TouchableOpacity
      testID={`import_archive_card_${collectionName}`}
      onPress={onArchivePress}
      style={colorSchemeStyle.cardStyle}>
      <View style={localStyle.optionsView}>
        <TouchableOpacity
          testID="import_archive_card_delete_icon"
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
    borderWidth: layoutPtToPx(4),
    borderColor: colors.Transparent,
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
