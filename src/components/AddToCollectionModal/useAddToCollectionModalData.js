import {useState, useEffect, useCallback, useRef} from 'react';
import {collectionService} from '../../services/CollectionService';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';
import Toast from 'react-native-toast-message';
import {ToastPosition, ToastType} from '../../constants/ToastConstants';
import {compareFunction, replace} from '../../utils/Strings';
import Cache from '../../services/Cache';
import {CacheKey} from '../../services/Cache/CacheStoreConstants';

function useAddToCollectionModalData() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef(null);
  const collectionListRef = useRef(null);
  const tweetCollectionIdsArrays = useRef([]);

  const getCollectionsList = useCallback(() => {
    setIsLoading(true);
    collectionService()
      .getAllCollections()
      .then(list => {
        const listArray = Object.entries(list);
        const userToCollectionMap = Cache.getValue(
          CacheKey.BookmarkedTweetsList,
        );
        const collectionIdArray =
          userToCollectionMap?.[modalRef.current?.tweetId] || [];

        listArray.sort(function compare(collection1, collection2) {
          if (
            collectionIdArray?.includes(collection1[1].id) &&
            collectionIdArray?.includes(collection2[1].id)
          ) {
            // if tweet is present in both collections
            return compareFunction(collection1[1].name, collection2[1].name);
          } else if (collectionIdArray.includes(collection1[1].id)) {
            // if tweet is present in collection1
            return -1;
          } else if (collectionIdArray.includes(collection2[1].id)) {
            // if tweet is present in collection2
            return 1;
          }

          // if tweet is not present in any collection
          return compareFunction(collection1[1].name, collection2[1].name);
        });
        collectionListRef.current = Object.fromEntries(listArray);

        const bookmarkedTweetList = Cache.getValue(
          CacheKey.BookmarkedTweetsList,
        );
        tweetCollectionIdsArrays.current = modalRef.current?.tweetId
          ? bookmarkedTweetList?.[modalRef.current?.tweetId] || []
          : [];
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const onShowModal = payload => {
      modalRef.current = payload;
      setIsVisible(true);
      getCollectionsList();
    };

    LocalEvent.on(EventTypes.ShowAddToCollectionModal, onShowModal);

    return () => {
      LocalEvent.off(EventTypes.ShowAddToCollectionModal, onShowModal);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeModal = useCallback(() => {
    setIsVisible(false);
  }, []);

  const onBackdropPress = useCallback(() => {
    closeModal();
  }, [closeModal]);

  const showAddToCollectionToast = useCallback(collectionName => {
    Toast.show({
      type: ToastType.Success,
      text1: replace('Added tweet to {{collectionName}}', {
        collectionName,
      }),
      position: ToastPosition.Top,
    });
  }, []);

  const onAddToCollectionSuccess = useCallback(
    (collectionName, collectionId) => {
      showAddToCollectionToast(collectionName);
      modalRef.current?.onAddToCollectionSuccess?.(collectionId);
    },
    [showAddToCollectionToast],
  );

  const onAddCollectionSuccess = useCallback(
    (collectionName, collectionId) => {
      getCollectionsList();
      setIsVisible(true);
      showAddToCollectionToast(collectionName);
      modalRef.current?.onAddToCollectionSuccess?.(collectionId);
    },
    [getCollectionsList, showAddToCollectionToast],
  );

  const onAddToCollectionFailure = useCallback(() => {
    Toast.show({
      type: ToastType.Error,
      text1: 'Could not add tweet to collection',
    });
  }, []);

  const onRemoveFromCollectionSuccess = useCallback(collectionName => {
    Toast.show({
      type: ToastType.Success,
      text1: replace('Removed tweet from {{collectionName}}', {
        collectionName,
      }),
      position: ToastPosition.Top,
    });
  }, []);

  const onAddCollectionPress = useCallback(() => {
    setIsVisible(false);
    LocalEvent.emit(EventTypes.ShowAddCollectionModal, {
      tweetId: modalRef.current?.tweetId,
      onCollectionAddSuccess: (collectionName, collectionId) => {
        getCollectionsList();
        setIsVisible(true);
        showAddToCollectionToast(collectionName, collectionId);
      },
      onAddToCollectionSuccess: onAddCollectionSuccess,
    });
  }, [getCollectionsList, onAddCollectionSuccess, showAddToCollectionToast]);

  return {
    aTweetCollectionIds: tweetCollectionIdsArrays.current,
    bIsVisible: isVisible,
    bIsLoading: isLoading,
    sTweetId: modalRef.current?.tweetId || null,
    oCollectionList: collectionListRef.current,
    fnOnBackdropPress: onBackdropPress,
    fnOnAddToCollectionSuccess: onAddToCollectionSuccess,
    fnOnAddToCollectionFailure: onAddToCollectionFailure,
    fnOnAddCollectionPress: onAddCollectionPress,
    fnOnDonePress: closeModal,
    fnOnRemoveFromCollectionSuccess: onRemoveFromCollectionSuccess,
  };
}

export default useAddToCollectionModalData;
