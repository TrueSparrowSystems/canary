import {StackActions, useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';
import ScreenName from '../../constants/ScreenName';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';
import Toast from 'react-native-toast-message';
import {ToastPosition, ToastType} from '../../constants/ToastConstants';

function useTweetCardData(props) {
  const {dataSource} = props;
  const {public_metrics} = dataSource;

  const navigation = useNavigation();

  const onAddToCollectionPress = useCallback(() => {
    LocalEvent.emit(EventTypes.ShowAddToCollectionModal, {
      tweetId: dataSource.id,
    });
  }, [dataSource]);

  const onCardPress = useCallback(() => {
    if (public_metrics?.reply_count > 0) {
      navigation.dispatch(
        StackActions.push(ScreenName.ThreadScreen, {tweetData: dataSource}),
      );
    } else {
      Toast.show({
        type: ToastType.Info,
        text1: 'This tweet does not contain any replies',
        position: ToastPosition.Top,
      });
    }
  }, [dataSource, navigation, public_metrics?.reply_count]);

  const onUserNamePress = useCallback(() => {
    navigation.push(ScreenName.SearchResultScreen, {
      query: `from:${dataSource.user?.username}`,
    });
  }, [dataSource, navigation]);

  return {
    fnOnAddToCollectionPress: onAddToCollectionPress,
    fnOnCardPress: onCardPress,
    fnOnUserNamePress: onUserNamePress,
  };
}

export default useTweetCardData;
