import {StackActions, useNavigation} from '@react-navigation/native';
import {useCallback, useMemo} from 'react';
import ScreenName from '../../constants/ScreenName';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';
import Toast from 'react-native-toast-message';
import {ToastPosition, ToastType} from '../../constants/ToastConstants';
import {Share} from 'react-native';
import {replace} from '../../utils/Strings';

function useTweetCardData(props) {
  const {dataSource} = props;
  const {public_metrics, user, id} = dataSource;

  const tweetUrl = useMemo(() => {
    const url = replace(
      'https://twitter.com/{{userName}}/status/{{tweetId}}/',
      {userName: user?.username, tweetId: id},
    );
    return url;
  }, [id, user]);

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

  const onSharePress = useCallback(() => {
    Share.share({
      message: `Check out this tweet!\n\n${tweetUrl}\n\nSent from Canary app`,
    });
  }, [tweetUrl]);

  return {
    bCanShare: !!tweetUrl,
    fnOnAddToCollectionPress: onAddToCollectionPress,
    fnOnCardPress: onCardPress,
    fnOnUserNamePress: onUserNamePress,
    fnOnSharePress: onSharePress,
  };
}

export default useTweetCardData;
