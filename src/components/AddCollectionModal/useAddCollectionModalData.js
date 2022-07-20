import {useState, useEffect, useCallback, useRef} from 'react';
import {collectionService} from '../../services/CollectionService';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';

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
      // TODO: Show empty collection name message
      return;
    }
    const _collectionService = collectionService();
    _collectionService
      .addCollection(collectionNameRef.current)
      .then(() => {
        // TODO: Show success toast
        closeModal();
        modalData?.onCollectionAddSuccess();
      })
      .catch(() => {
        // TODO: Show error toast
      })
      .finally(() => {
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
