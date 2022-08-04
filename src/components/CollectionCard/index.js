import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useMemo} from 'react';
import {
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableHighlight,
} from 'react-native';
import {BinIcon} from '../../assets/common';
import ScreenName from '../../constants/ScreenName';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import colors from '../../constants/colors';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import Image from 'react-native-fast-image';
import fonts from '../../constants/fonts';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';
import {getRandomColorCombination} from '../../utils/RandomColorUtil';

function CollectionCard(props) {
  const {data, onCollectionRemoved, onLongPress, enableDelete} = props;
  const {name: collectionName, id: collectionId} = data;
  let {colorScheme} = data;
  const localStyle = useStyleProcessor(styles, 'CollectionCard');
  const navigation = useNavigation();

  const onCollectionPress = useCallback(() => {
    navigation.navigate(ScreenName.CollectionTweetScreen, {
      collectionId,
      collectionName,
    });
  }, [collectionId, collectionName, navigation]);

  const onCollectionRemove = useCallback(() => {
    LocalEvent.emit(EventTypes.ShowDeleteCollectionConfirmationModal, {
      id: collectionId,
      name: collectionName,
      onCollectionRemoved,
    });
  }, [collectionId, collectionName, onCollectionRemoved]);

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
    <TouchableWithoutFeedback
      onPress={onCollectionPress}
      onLongPress={onLongPress}>
      <View style={localStyle.container}>
        {collectionId ? (
          <View style={colorSchemeStyle.cardStyle}>
            {enableDelete ? (
              <TouchableHighlight
                underlayColor={colors.Transparent}
                style={localStyle.binContainer}
                onPress={onCollectionRemove}>
                <Image source={BinIcon} style={localStyle.binIconStyle} />
              </TouchableHighlight>
            ) : null}
            <Text numberOfLines={3} style={colorSchemeStyle.textStyle}>
              {collectionName}
            </Text>
          </View>
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = {
  container: {
    marginBottom: layoutPtToPx(20),
    marginRight: layoutPtToPx(20),
    borderRadius: layoutPtToPx(6),
    flex: 1,
    aspectRatio: 1,
  },
  binContainer: {
    position: 'absolute',
    right: layoutPtToPx(-5),
    top: layoutPtToPx(-5),
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
  textStyle: {
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(24),
    lineHeight: layoutPtToPx(30),
    padding: layoutPtToPx(8),
  },
  imageStyle: {
    height: layoutPtToPx(150),
    width: '100%',
    borderRadius: 6,
  },
  cardStyle: {
    flex: 1,
    borderRadius: layoutPtToPx(12),
    justifyContent: 'flex-end',
  },
};

export default React.memo(CollectionCard);
