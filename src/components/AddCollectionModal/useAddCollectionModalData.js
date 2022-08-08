import {useState, useEffect, useCallback, useRef} from 'react';
import {collectionService} from '../../services/CollectionService';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';
import Toast from 'react-native-toast-message';
import {ToastPosition, ToastType} from '../../constants/ToastConstants';

function useAddCollectionModalData() {
  const [isVisible, setIsVisible] = useState(false);
  const collectionNameRef = useRef('');
  const [modalData, setModalData] = useState(null);
  const [charCount, setCharCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const onShowModal = payload => {
      setModalData(payload);
      setIsVisible(true);
      setCharCount(0);
      setErrorMessage('');
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
    setCharCount(newValue?.length || 0);
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
              modalData?.onAddToCollectionSuccess?.(
                collectionNameRef.current,
                collectionId,
              );
              closeModal();
            })
            .catch(() => {});
        } else {
          closeModal();

          modalData?.onCollectionAddSuccess();
        }
      })
      .catch(err => {
        Toast.show({
          type: ToastType.Error,
          text1: 'Collection could not be created. Please try again',
          position: ToastPosition.Top,
        });
        setErrorMessage(err);
      })
      .finally(() => {
        _collectionService.getAllCollections();
      });
  }, [closeModal, modalData]);

  return {
    bIsVisible: isVisible,
    nCharacterCount: charCount,
    sErrorMessage: errorMessage,
    fnOnBackdropPress: onBackdropPress,
    fnOnCollectionNameChange: onCollectionNameChange,
    fnOnCreateCollectionPress: onCreateCollectionPress,
  };
}

export default useAddCollectionModalData;
