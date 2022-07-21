import {useCallback, useState, useRef, useEffect} from 'react';
import TwitterAPI from '../../api/helpers/TwitterAPI';
import {collectionService} from '../../services/CollectionService';
import {getTweetData} from '../utils/ViewData';

function useCollectionTweetListData(props) {
  const {collectionId} = props;
  const [isLoading, setIsLoading] = useState(false);
  const listDataRef = useRef([]);
  const _collectionService = collectionService();

  const fetchData = useCallback(() => {
    setIsLoading(true);
    _collectionService
      .getCollectionDetails(collectionId)
      .then(collectionData => {
        var ids = collectionData?.tweetIds.join(',');
        TwitterAPI.multipleTweetLookup(ids)
          .then(apiResponse => {
            var array = [];
            const {data} = apiResponse;
            const newData = data?.data;
            newData.forEach(tweet => {
              const tweetData = getTweetData(tweet, apiResponse);
              array.push(tweetData);
            });
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

  return {
    bIsLoading: isLoading,
    fnOnRefresh: onRefresh,
    aDataSource: listDataRef.current,
  };
}

export default useCollectionTweetListData;
