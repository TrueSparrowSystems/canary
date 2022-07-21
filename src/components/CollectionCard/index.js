import {useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  TouchableHighlight,
} from 'react-native';
import {BinIcon} from '../../assets/common';
import ScreenName from '../../constants/ScreenName';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {collectionService} from '../../services/CollectionService';
import colors from '../../utils/colors';
import {layoutPtToPx} from '../../utils/responsiveUI';

function CollectionCard(props) {
  const {data, onCollectionRemoved} = props;
  const {imageUrl, collectionName, collectionId} = data;
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
        // TODO: show toast
        onCollectionRemoved();
      })
      .catch(() => {
        // TODO: show error toast
      });
  }, [collectionId, onCollectionRemoved]);

  return (
    <TouchableWithoutFeedback onPress={onCollectionPress}>
      <View style={localStyle.container}>
        <TouchableHighlight
          underlayColor={colors.Transparent}
          style={localStyle.binContainer}
          onPress={onCollectionRemove}>
          <Image source={BinIcon} style={localStyle.binIconStyle} />
        </TouchableHighlight>
        <Image source={{uri: imageUrl}} style={localStyle.imageStyle} />
        <Text style={localStyle.textStyle}>{collectionName}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = {
  container: {
    marginBottom: layoutPtToPx(10),
    marginHorizontal: layoutPtToPx(20),
    borderRadius: layoutPtToPx(6),
  },
  binContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    height: layoutPtToPx(40),
    width: layoutPtToPx(40),
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  binIconStyle: {
    height: layoutPtToPx(20),
    width: layoutPtToPx(20),
  },
  textStyle: {
    marginTop: 5,
    color: colors.SherpaBlue,
  },
  imageStyle: {
    height: layoutPtToPx(150),
    width: '100%',
    borderRadius: 6,
  },
};

export default React.memo(CollectionCard);
