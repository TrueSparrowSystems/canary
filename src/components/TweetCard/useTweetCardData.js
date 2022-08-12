import {StackActions, useNavigation} from '@react-navigation/native';
import {useCallback, useMemo, useState} from 'react';
import ScreenName from '../../constants/ScreenName';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';
import Toast from 'react-native-toast-message';
import {ToastPosition, ToastType} from '../../constants/ToastConstants';
import {Share} from 'react-native';
import {replace} from '../../utils/Strings';
import {checkIsTweetBookmarked} from '../utils/ViewData';
import {SortOrder} from '../../api/helpers/TwitterAPI';

function useTweetCardData(props) {
  const {dataSource} = props;
  const {public_metrics, user, id, media} = dataSource;
  const [isTweetBookmarked, setIsTweetBookmarked] = useState(
    checkIsTweetBookmarked(id),
  );

  const tweetUrl = useMemo(() => {
    const url = replace(
      'https://twitter.com/{{userName}}/status/{{tweetId}}/',
      {userName: user?.username, tweetId: id},
    );
    return url;
  }, [id, user]);

  const navigation = useNavigation();

  const onBookmarkButtonPress = useCallback(() => {
    LocalEvent.emit(EventTypes.ShowAddToCollectionModal, {
      tweetId: id,
      onAddToCollectionSuccess: () => {
        setIsTweetBookmarked(true);
      },
      onRemoveFromAllCollectionSuccess: () => {
        setIsTweetBookmarked(false);
      },
    });
  }, [id]);

  const onAddToListSuccess = useCallback(() => {
    LocalEvent.emit(EventTypes.UpdateList);
  }, []);

  const onAddToListPress = useCallback(() => {
    LocalEvent.emit(EventTypes.ShowAddToListModal, {
      userName: user.username,
      onAddToListSuccess: onAddToListSuccess,
    });
  }, [onAddToListSuccess, user]);

  const hasMedia = useMemo(() => {
    return media && media?.length !== 0;
  }, [media]);

  const onCardPress = useCallback(() => {
    if (public_metrics?.reply_count > 0) {
      dataSource.isBookmarked = checkIsTweetBookmarked(id);
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
  }, [dataSource, id, navigation, public_metrics?.reply_count]);

  const onUserNamePress = useCallback(() => {
    navigation.push(ScreenName.SearchResultScreen, {
      query: `from:${dataSource.user?.username}`,
      sortOrder: SortOrder.Recency,
    });
  }, [dataSource, navigation]);

  const onTweetBookmarked = useCallback(newValue => {
    setIsTweetBookmarked(newValue);
  }, []);

  const onSharePress = useCallback(() => {
    Share.share({
      message: `Check out this tweet!\n\n${tweetUrl}\n\nSent from Canary app`,
    });
  }, [tweetUrl]);

  return {
    bCanShare: !!tweetUrl,
    bHasMedia: hasMedia,
    bIsTweetBookmarked: isTweetBookmarked,
    fnOnAddToListPress: onAddToListPress,
    fnOnBookmarkButtonPress: onBookmarkButtonPress,
    fnOnCardPress: onCardPress,
    fnOnUserNamePress: onUserNamePress,
    fnSetIsTweetBookmarked: onTweetBookmarked,
    fnOnSharePress: onSharePress,
  };
}

export default useTweetCardData;
