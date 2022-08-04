import {useState, useEffect, useCallback} from 'react';
import Toast from 'react-native-toast-message';
import {ToastType} from '../../../constants/ToastConstants';
import {collectionService} from '../../../services/CollectionService';
import {EventTypes, LocalEvent} from '../../../utils/LocalEvent';
import {replace} from '../../../utils/Strings';

function useConfirmDeleteModalData() {
  const [isVisible, setIsVisible] = useState(false);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    const onShowModal = payload => {
      setModalData(payload);
      setIsVisible(true);
    };

    LocalEvent.on(
      EventTypes.ShowDeleteCollectionConfirmationModal,
      onShowModal,
    );

    return () => {
      LocalEvent.off(
        EventTypes.ShowDeleteCollectionConfirmationModal,
        onShowModal,
      );
    };
  });

  const closeModal = useCallback(() => {
    setIsVisible(false);
  }, []);

  const onBackdropPress = useCallback(() => {
    closeModal();
  }, [closeModal]);

  const onSureButtonPress = useCallback(() => {
    collectionService()
      .removeCollection(modalData?.id)
      .then(() => {
        modalData?.onCollectionRemoved?.();
        Toast.show({
          type: ToastType.Success,
          text1: 'Removed collection.',
        });
      })
      .catch(() => {
        Toast.show({
          type: ToastType.Error,
          text1: 'Error in removing collection.',
        });
      })
      .finally(() => {
        closeModal();
      });
  }, [closeModal, modalData]);

  return {
    bIsVisible: isVisible,
    fnOnBackdropPress: onBackdropPress,
    sText: replace(
      'Are you sure you want to remove “{{name}}” from archives?',
      {name: modalData?.name},
    ),
    fnOnCancelPress: closeModal,
    fnOnSureButtonPress: onSureButtonPress,
  };
}

export default useConfirmDeleteModalData;
