import {useCallback, useState} from 'react';
import {collectionService} from '../../services/CollectionService';

function useMiniCollectionCardData(
  collectionId,
  tweetId,
  collectionName,
  onAddToCollectionSuccess,
  onAddToCollectionFailure,
  onRemoveFromCollectionSuccess,
  isAdded,
) {
  const [isTweetAddedInThisCollection, setIsTweetAddedInThisCollection] =
    useState(isAdded);
  const onAddToCollectionPress = useCallback(() => {
    collectionService()
      .addTweetToCollection(collectionId, tweetId)
      .then(() => {
        onAddToCollectionSuccess?.(collectionName, collectionId);
        setIsTweetAddedInThisCollection(true);
      })
      .catch(() => {
        onAddToCollectionFailure();
      });
  }, [
    collectionId,
    collectionName,
    onAddToCollectionFailure,
    onAddToCollectionSuccess,
    tweetId,
  ]);

  const onRemoveFromCollectionPress = useCallback(() => {
    collectionService()
      .removeTweetFromCollection(collectionId, tweetId)
      .then(() => {
        onRemoveFromCollectionSuccess(collectionName);
        setIsTweetAddedInThisCollection(false);
      })
      .catch(() => {});
  }, [collectionId, collectionName, onRemoveFromCollectionSuccess, tweetId]);

  return {
    bIsTweetAddedToCollection: isTweetAddedInThisCollection,
    fnOnAddToCollectionPress: onAddToCollectionPress,
    fnOnRemoveFromCollectionPress: onRemoveFromCollectionPress,
  };
}
export default useMiniCollectionCardData;
