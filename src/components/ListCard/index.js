import {useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
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
import {listService} from '../../services/ListService';
import colors from '../../constants/colors';
import {layoutPtToPx} from '../../utils/responsiveUI';
import Toast from 'react-native-toast-message';
import Image from 'react-native-fast-image';

function ListCard(props) {
  const {data, onListRemoved} = props;
  const {imageUrl, listName, listId} = data;
  const localStyle = useStyleProcessor(styles, 'ListCard');
  const navigation = useNavigation();

  const onListPress = useCallback(() => {
    navigation.navigate(ScreenName.ListTweetsScreen, {
      listId,
      listName,
    });
  }, [listId, listName, navigation]);

  const onListRemove = useCallback(() => {
    listService()
      .removeList(listId)
      .then(() => {
        onListRemoved();
        Toast.show({
          type: ToastType.Success,
          text1: 'Removed list.',
        });
      })
      .catch(() => {
        Toast.show({
          type: ToastType.Error,
          text1: 'Error in removing list.',
        });
      });
  }, [listId, onListRemoved]);

  return (
    <TouchableWithoutFeedback onPress={onListPress}>
      <View style={localStyle.container}>
        <TouchableHighlight
          underlayColor={colors.Transparent}
          style={localStyle.binContainer}
          onPress={onListRemove}>
          <Image source={BinIcon} style={localStyle.binIconStyle} />
        </TouchableHighlight>
        <Image source={{uri: imageUrl}} style={localStyle.imageStyle} />
        <Text style={localStyle.textStyle}>{listName}</Text>
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

export default React.memo(ListCard);
