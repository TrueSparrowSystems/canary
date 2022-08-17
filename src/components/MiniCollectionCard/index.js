import React, {useMemo} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import Image from 'react-native-fast-image';
import {getRandomColorCombination} from '../../utils/RandomColorUtil';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import fonts from '../../constants/fonts';
import {TickIcon} from '../../assets/common';
import colors, {getColorWithOpacity} from '../../constants/colors';
import useMiniCollectionCardData from './useMiniCollectionCardData';

function MiniCollectionCard(props) {
  const {
    data,
    tweetId,
    onAddToCollectionSuccess,
    onAddToCollectionFailure,
    onRemoveFromCollectionSuccess,
    isAdded,
  } = props;
  const {name: collectionName, id: collectionId} = data;
  let {colorScheme} = data;
  const localStyle = useStyleProcessor(styles, 'MiniCollectionCard');

  const {
    bIsTweetAddedToCollection,
    fnOnAddToCollectionPress,
    fnOnRemoveFromCollectionPress,
  } = useMiniCollectionCardData(
    collectionId,
    tweetId,
    collectionName,
    onAddToCollectionSuccess,
    onAddToCollectionFailure,
    onRemoveFromCollectionSuccess,
    isAdded,
  );
  const colorSchemeStyle = useMemo(() => {
    if (!colorScheme) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      colorScheme = getRandomColorCombination();
    }
    return {
      cardStyle: [
        localStyle.cardStyle,
        {backgroundColor: colorScheme?.backgroundColor},
      ],
      textStyle: [localStyle.textStyle, {color: colorScheme?.textColor}],
    };
  }, [colorScheme, localStyle.cardStyle]);

  return (
    <TouchableOpacity
      onPress={
        bIsTweetAddedToCollection
          ? fnOnRemoveFromCollectionPress
          : fnOnAddToCollectionPress
      }
      style={colorSchemeStyle.cardStyle}>
      {bIsTweetAddedToCollection ? (
        <View style={localStyle.tickIconContainer}>
          <Image source={TickIcon} style={localStyle.tickIcon} />
        </View>
      ) : null}
      <Text numberOfLines={3} style={colorSchemeStyle.textStyle}>
        {collectionName}
      </Text>
    </TouchableOpacity>
  );
}

const styles = {
  container: {
    marginBottom: 10,
    marginHorizontal: 20,
    borderRadius: 6,
    width: 75,
    alignItems: 'center',
  },
  cardStyle: {
    height: layoutPtToPx(160),
    width: layoutPtToPx(160),
    borderRadius: layoutPtToPx(11),
    justifyContent: 'flex-end',
    marginHorizontal: layoutPtToPx(6),
  },
  tickIconContainer: {
    backgroundColor: getColorWithOpacity(colors.White, 0.5),
    position: 'absolute',
    zIndex: 1,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: layoutPtToPx(11),
  },
  tickIcon: {
    height: layoutPtToPx(42),
    width: layoutPtToPx(57),
  },
  textStyle: {
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(24),
    lineHeight: layoutPtToPx(30),
    padding: layoutPtToPx(8),
  },
};

export default React.memo(MiniCollectionCard);
