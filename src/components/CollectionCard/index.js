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
import {ToastType} from '../../constants/ToastConstants';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {collectionService} from '../../services/CollectionService';
import colors from '../../constants/colors';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import Toast from 'react-native-toast-message';
import Image from 'react-native-fast-image';
import {getRandomColorCombination} from '../../utils/RandomColorUtil';
import fonts from '../../constants/fonts';

function CollectionCard(props) {
  const {data, onCollectionRemoved} = props;
  const {name: collectionName, id: collectionId} = data;
  const localStyle = useStyleProcessor(styles, 'CollectionCard');
  const navigation = useNavigation();

  const onCollectionPress = useCallback(() => {
    navigation.navigate(ScreenName.CollectionTweetScreen, {
      collectionId,
      collectionName,
    });
  }, [collectionId, collectionName, navigation]);

  const onCollectionRemove = useCallback(() => {
    collectionService()
      .removeCollection(collectionId)
      .then(() => {
        onCollectionRemoved();
        Toast.show({
          type: ToastType.Success,
          text1: 'Removed collection.',
        });
      })
      .catch(() => {
        Toast.show({
          type: ToastType.Error,
          text1: 'Error in removing collection.',
        });
      });
  }, [collectionId, onCollectionRemoved]);

  const colorCombination = getRandomColorCombination();

  const cardStyle = useMemo(() => {
    return [
      localStyle.cardStyle,
      {backgroundColor: colorCombination.backgroundColor},
    ];
  }, [colorCombination.backgroundColor, localStyle.cardStyle]);

  const textStyle = useMemo(() => {
    return [localStyle.textStyle, {color: colorCombination.textColor}];
  }, [colorCombination.textColor, localStyle.textStyle]);

  return (
    <TouchableWithoutFeedback onPress={onCollectionPress}>
      <View style={localStyle.container}>
        {collectionId ? (
          <View style={cardStyle}>
            <TouchableHighlight
              underlayColor={colors.Transparent}
              style={localStyle.binContainer}
              onPress={onCollectionRemove}>
              <Image source={BinIcon} style={localStyle.binIconStyle} />
            </TouchableHighlight>
            <Text numberOfLines={3} style={textStyle}>
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
    height: layoutPtToPx(20),
    width: layoutPtToPx(20),
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
