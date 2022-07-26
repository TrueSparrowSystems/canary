import React, {useCallback} from 'react';
import {Text, View, TouchableWithoutFeedback} from 'react-native';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {listService} from '../../services/ListService';
import colors from '../../utils/colors';
import Image from 'react-native-fast-image';

function MiniListCard(props) {
  const {data, userName, onAddToListSuccess} = props;
  const {imageUrl, listName, listId} = data;
  const localStyle = useStyleProcessor(styles, 'MiniListCard');

  const onAddToListPress = useCallback(() => {
    listService()
      .addUserToList(listId, userName)
      .then(() => {
        onAddToListSuccess(listName, listId);
      });
  }, [listId, listName, onAddToListSuccess, userName]);

  return (
    <TouchableWithoutFeedback onPress={onAddToListPress}>
      <View style={localStyle.container}>
        <Image source={{uri: imageUrl}} style={localStyle.imageStyle} />
        <Text style={localStyle.textStyle} numberOfLines={1}>
          {listName}
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

export default React.memo(MiniListCard);
