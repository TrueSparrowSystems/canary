import React, {useCallback} from 'react';
import {Text, View, Image, TouchableWithoutFeedback} from 'react-native';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {collectionService} from '../../services/CollectionService';
import colors from '../../utils/colors';

function MiniCollectionCard(props) {
  const {data, tweetId, onAddToCollectionSuccess} = props;
  const {imageUrl, collectionName, collectionId} = data;
  const localStyle = useStyleProcessor(styles, 'MiniCollectionCard');

  const onAddToCollectionPress = useCallback(() => {
    // TODO: Navigate to collection screen
    console.log({tweetId, collectionId});
    collectionService()
      .addTweetToCollection(collectionId, tweetId)
      .then(() => {
        onAddToCollectionSuccess(collectionName);
      });
  }, [collectionId, collectionName, onAddToCollectionSuccess, tweetId]);

  return (
    <TouchableWithoutFeedback onPress={onAddToCollectionPress}>
      <View style={localStyle.container}>
        <Image source={{uri: imageUrl}} style={localStyle.imageStyle} />
        <Text style={localStyle.textStyle} numberOfLines={1}>
          {collectionName}
        </Text>
      </View>
    </TouchableWithoutFeedback>
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
  textStyle: {
    marginTop: 5,
    color: colors.SherpaBlue,
  },
  imageStyle: {
    aspectRatio: 1,
    width: '100%',
    borderRadius: 6,
  },
};

export default React.memo(MiniCollectionCard);
