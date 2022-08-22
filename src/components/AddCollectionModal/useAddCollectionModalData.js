import {useState, useEffect, useCallback, useRef} from 'react';
import {collectionService} from '../../services/CollectionService';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';
import Toast from 'react-native-toast-message';
import {ToastPosition, ToastType} from '../../constants/ToastConstants';

function useAddCollectionModalData() {
  const [isVisible, setIsVisible] = useState(false);
  const collectionNameRef = useRef('');
  const importCollectionTextRef = useRef('');
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
    collectionNameRef.current = '';

    setIsVisible(false);
  }, []);

  const onBackdropPress = useCallback(() => {
    closeModal();
  }, [closeModal]);

  const onCollectionNameChange = useCallback(newValue => {
    collectionNameRef.current = newValue;
    setCharCount(newValue?.length || 0);
  }, []);

  const onImportCollectionTextChange = useCallback(newValue => {
    importCollectionTextRef.current = newValue;
  }, []);

  const onCreateCollectionPress = useCallback(() => {
    if (collectionNameRef.current.trim().length === 0) {
      Toast.show({
        type: ToastType.Error,
        text1: 'Archive name cannot be empty.',
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
          text1: 'Archive created successfully.',
          position: ToastPosition.Top,
        });
        if (modalData?.tweetId) {
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
          modalData?.onCollectionAddSuccess();
          closeModal();
        }
      })
      .catch(err => {
        collectionNameRef.current = '';

        Toast.show({
          type: ToastType.Error,
          text1: 'Archive could not be created. Please try again',
          position: ToastPosition.Top,
        });
        setErrorMessage(err);
      })
      .finally(() => {
        _collectionService.getAllCollections();
      });
  }, [closeModal, modalData]);

  const onImportCollectionPress = useCallback(() => {
    if (importCollectionTextRef.current.trim().length === 0) {
      Toast.show({
        type: ToastType.Error,
        text1: 'Import URL cannot be empty.',
        position: ToastPosition.Top,
      });
      return;
    }
    const _collectionService = collectionService();
    _collectionService
      .importCollection(importCollectionTextRef.current)
      .then(({collectionId}) => {
        Toast.show({
          type: ToastType.Success,
          text1: 'Archive imported successfully.',
          position: ToastPosition.Top,
        });
        if (modalData?.tweetId) {
          _collectionService
            .addTweetToCollection(collectionId, modalData.tweetId)
            .then(() => {
              modalData?.onAddToCollectionSuccess?.(
                importCollectionTextRef.current,
                collectionId,
              );
              closeModal();
            })
            .catch(() => {});
        } else {
          modalData?.onCollectionAddSuccess();
          closeModal();
        }
      })
      .catch(err => {
        importCollectionTextRef.current = '';

        Toast.show({
          type: ToastType.Error,
          text1: 'Archive could not be imported. Please try again',
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
    fnOnImportCollectionTextChange: onImportCollectionTextChange,
    fnOnCreateCollectionPress: onCreateCollectionPress,
    fnOnImportCollectionPress: onImportCollectionPress,
  };
}

export default useAddCollectionModalData;
