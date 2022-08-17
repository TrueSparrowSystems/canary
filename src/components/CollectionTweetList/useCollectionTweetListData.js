import {useNavigation} from '@react-navigation/native';
import {useCallback, useState, useRef, useEffect} from 'react';
import TwitterAPI from '../../api/helpers/TwitterAPI';
import ScreenName from '../../constants/ScreenName';
import {collectionService} from '../../services/CollectionService';
import {getTweetData} from '../utils/ViewData';

function useCollectionTweetListData(props) {
  const {collectionId} = props;
  const [isLoading, setIsLoading] = useState(false);
  const listDataRef = useRef([]);
  const _collectionService = collectionService();
  const navigation = useNavigation();

  const fetchData = useCallback(() => {
    setIsLoading(true);
    _collectionService
      .getCollectionDetails(collectionId)
      .then(collectionData => {
        listDataRef.current = [];
        var ids = collectionData?.tweetIds.join(',');
        TwitterAPI.multipleTweetLookup(ids)
          .then(apiResponse => {
            var array = [];
            const {data} = apiResponse;
            const newData = data?.data;
            const errors = data?.errors;
            if (errors) {
              _collectionService.handleTweetError(collectionId, errors);
            }
            if (newData && newData.length > 0) {
              newData.forEach(tweet => {
                const tweetData = getTweetData(tweet, apiResponse);
                tweetData.collectionId = collectionId;
                array.push(tweetData);
              });
            }

            listDataRef.current = array;
          })
          .finally(() => {
            setIsLoading(false);
          });
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [_collectionService, collectionId]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const onBookmarkFavouriteTweetPress = useCallback(() => {
    navigation.navigate(ScreenName.TimelineScreen);
  }, [navigation]);

  return {
    aDataSource: listDataRef.current,
    bIsLoading: isLoading,
    fnOnBookmarkFavouriteTweetPress: onBookmarkFavouriteTweetPress,
    fnOnRefresh: onRefresh,
  };
}

export default useCollectionTweetListData;
