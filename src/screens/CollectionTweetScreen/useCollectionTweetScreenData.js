import {useEffect, useCallback, useState, useRef} from 'react';
import {collectionService} from '../../services/CollectionService';

function useCollectionTweetScreenData(props) {
  const {collectionId} = props;
  const [isLoading, setIsLoading] = useState(false);
  const collectionDataRef = useRef(null);

  const _collectionService = collectionService();

  const fetchData = useCallback(() => {
    setIsLoading(true);
    _collectionService
      .getCollectionDetails(collectionId)
      .then(details => {
        collectionDataRef.current = details;
      })
      .catch(() => {
        // Show error
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [_collectionService, collectionId]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    bIsLoading: isLoading,
    sCollectionName: collectionDataRef.current?.name,
  };
}

export default useCollectionTweetScreenData;
