import {useState, useEffect, useCallback, useRef} from 'react';
import {collectionService} from '../../services/CollectionService';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';
import Toast from 'react-native-toast-message';
import {ToastPosition, ToastType} from '../../constants/ToastConstants';

function useAddCollectionModalData() {
  const [isVisible, setIsVisible] = useState(false);
  const collectionNameRef = useRef('');
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    const onShowModal = payload => {
      setModalData(payload);
      setIsVisible(true);
    };

    LocalEvent.on(EventTypes.ShowAddCollectionModal, onShowModal);

    return () => {
      LocalEvent.off(EventTypes.ShowAddCollectionModal, onShowModal);
    };
  });

  const closeModal = useCallback(() => {
    setIsVisible(false);
  }, []);

  const onBackdropPress = useCallback(() => {
    closeModal();
  }, [closeModal]);

  const onCollectionNameChange = useCallback(newValue => {
    collectionNameRef.current = newValue;
  }, []);

  const onCreateCollectionPress = useCallback(() => {
    if (collectionNameRef.current.length === 0) {
      Toast.show({
        type: ToastType.Error,
        text1: 'Collection name cannot be empty.',
        position: ToastPosition.Top,
      });
      return;
    }
    const _collectionService = collectionService();
    _collectionService
      .addCollection(collectionNameRef.current)
      .then(({collectionId}) => {
        Toast.show({
          type: ToastType.Success,
          text1: 'Collection created successfully.',
          position: ToastPosition.Top,
        });
        if (modalData?.tweetId) {
          LocalEvent.emit(EventTypes.UpdateCollection);
          _collectionService
            .addTweetToCollection(collectionId, modalData.tweetId)
            .then(() => {
              modalData?.onAddToCollectionSuccess(
                collectionNameRef.current,
                collectionId,
              );
            })
            .catch(() => {});
        } else {
          modalData?.onCollectionAddSuccess();
        }
      })
      .catch(() => {
        Toast.show({
          type: ToastType.Error,
          text1: 'Collection could not be created. Please try again',
          position: ToastPosition.Top,
        });
      })
      .finally(() => {
        closeModal();
        _collectionService.getAllCollections();
      });
  }, [closeModal, modalData]);

  return {
    bIsVisible: isVisible,
    fnOnBackdropPress: onBackdropPress,
    fnOnCollectionNameChange: onCollectionNameChange,
    fnOnCreateCollectionPress: onCreateCollectionPress,
  };
}

export default useAddCollectionModalData;
