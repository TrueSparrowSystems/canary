import {useState, useEffect, useCallback, useRef} from 'react';
import {collectionService} from '../../services/CollectionService';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';
import Toast from 'react-native-toast-message';
import {ToastPosition, ToastType} from '../../constants/ToastConstants';
import {replace} from '../../utils/Strings';

function useAddToCollectionModalData() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalData, setModalData] = useState(null);
  const collectionListRef = useRef(null);

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
      closeModal();
      modalData?.onAddToCollectionSuccess(collectionId);
    },
    [closeModal, modalData, showAddToCollectionToast],
  );

  const onAddCollectionPress = useCallback(() => {
    setIsVisible(false);
    LocalEvent.emit(EventTypes.ShowAddCollectionModal, {
      tweetId: modalData?.tweetId,
      onCollectionAddSuccess: (collectionName, collectionId) => {
        showAddToCollectionToast(collectionName, collectionId);
      },
    });
  }, [modalData?.tweetId, showAddToCollectionToast]);

  return {
    bIsVisible: isVisible,
    bIsLoading: isLoading,
    sTweetId: modalData?.tweetId || null,
    oCollectionList: collectionListRef.current,
    fnOnBackdropPress: onBackdropPress,
    fnOnAddToCollectionSuccess: onAddToCollectionSuccess,
    fnOnAddCollectionPress: onAddCollectionPress,
  };
}

export default useAddToCollectionModalData;
