import {useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {Text, View, Image, TouchableWithoutFeedback} from 'react-native';
import ScreenName from '../../constants/ScreenName';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import colors from '../../utils/colors';

function CollectionCard(props) {
  const {data} = props;
  const {imageUrl, collectionName, collectionId} = data;
  const localStyle = useStyleProcessor(styles, 'CollectionCard');
  const navigation = useNavigation();

  const onCollectionPress = useCallback(() => {
    navigation.navigate(ScreenName.CollectionTweetScreen, {
      collectionId,
      collectionName,
    });
  }, [collectionId, collectionName, navigation]);

  return (
    <TouchableWithoutFeedback onPress={onCollectionPress}>
      <View style={localStyle.container}>
        <Image source={{uri: imageUrl}} style={localStyle.imageStyle} />
        <Text style={localStyle.textStyle}>{collectionName}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = {
  container: {
    marginBottom: 10,
    marginHorizontal: 20,
    borderRadius: 6,
  },
  textStyle: {
    marginTop: 5,
    color: colors.SherpaBlue,
  },
  imageStyle: {
    height: 150,
    width: '100%',
    borderRadius: 6,
  },
};

export default React.memo(CollectionCard);
