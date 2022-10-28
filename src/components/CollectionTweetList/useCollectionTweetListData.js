import {useNavigation} from '@react-navigation/native';
import {isArray} from 'lodash-es';
import {useCallback, useState, useRef, useEffect} from 'react';
import TwitterAPI from '../../api/helpers/TwitterAPI';
import ScreenName from '../../constants/ScreenName';
import {collectionService} from '../../services/CollectionService';
import {getTweetData} from '../utils/ViewData';

function useCollectionTweetListData(props) {
  const {collectionId, tweetIds = [], isImportMode = false} = props;
  const [isLoading, setIsLoading] = useState(false);
  const listDataRef = useRef([]);
  const _collectionService = collectionService();
  const navigation = useNavigation();

  const lookupTweets = useCallback(
    _tweetIds => {
      var ids = _tweetIds.join(',');
      TwitterAPI.multipleTweetLookup(ids)
        .then(apiResponse => {
          var array = [];
          const data = apiResponse?.data || {};
          const newData = data?.data;
          const errors = data?.errors;
          if (errors) {
            if (isImportMode) {
              errors.forEach(error => {
                if (
                  (error?.title === 'Not Found Error' ||
                    error?.title === 'Authorization Error') &&
                  error?.parameter === 'ids'
                ) {
                  const tweetId = error?.value;
                  if (tweetId) {
                    array.push({
                      isDeletedTweet: true,
                      id: tweetId,
                      tweetErrorText:
                        error?.title === 'Not Found Error'
                          ? 'This Tweet Is Deleted'
                          : 'This Tweet Is Not Accessible',
                    });
                  }
                }
              });
            } else {
              _collectionService.handleTweetError(collectionId, errors);
            }
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
        .catch(() => {})
        .finally(() => {
          setIsLoading(false);
        });
    },
    [_collectionService, collectionId, isImportMode],
  );

  const fetchData = useCallback(() => {
    setIsLoading(true);
    if (isArray(tweetIds) && tweetIds.length > 0) {
      lookupTweets(tweetIds);
    } else {
      _collectionService
        .getCollectionDetails(collectionId)
        .then(collectionData => {
          listDataRef.current = [];
          lookupTweets(collectionData?.tweetIds);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [_collectionService, collectionId, lookupTweets, tweetIds]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(tweetIds)]);

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
