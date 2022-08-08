import {useState, useEffect, useCallback, useRef} from 'react';
import {collectionService} from '../../services/CollectionService';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';
import Toast from 'react-native-toast-message';
import {ToastPosition, ToastType} from '../../constants/ToastConstants';
import {replace} from '../../utils/Strings';
import Cache from '../../services/Cache';
import {CacheKey} from '../../services/Cache/CacheStoreConstants';

function useAddToCollectionModalData() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalData, setModalData] = useState(null);
  const collectionListRef = useRef(null);
  const tweetCollectionIdsArrays = useRef([]);

  const getCollectionsList = useCallback(() => {
    setIsLoading(true);
    collectionService()
      .getAllCollections()
      .then(list => {
        collectionListRef.current = JSON.parse(list);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const onShowModal = payload => {
      setModalData(payload);
      setIsVisible(true);
      getCollectionsList();
      const bookmarkedTweetList = Cache.getValue(CacheKey.BookmarkedTweetsList);
      tweetCollectionIdsArrays.current = payload?.tweetId
        ? bookmarkedTweetList?.[payload.tweetId] || []
        : [];
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
      modalData?.onAddToCollectionSuccess(collectionId);
    },
    [modalData, showAddToCollectionToast],
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
      tweetId: modalData?.tweetId,
      onCollectionAddSuccess: (collectionName, collectionId) => {
        getCollectionsList();
        setIsVisible(true);
        showAddToCollectionToast(collectionName, collectionId);
      },
      onAddToCollectionSuccess,
    });
  }, [
    getCollectionsList,
    modalData?.tweetId,
    onAddToCollectionSuccess,
    showAddToCollectionToast,
  ]);

  return {
    aTweetCollectionIds: tweetCollectionIdsArrays.current,
    bIsVisible: isVisible,
    bIsLoading: isLoading,
    sTweetId: modalData?.tweetId || null,
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
