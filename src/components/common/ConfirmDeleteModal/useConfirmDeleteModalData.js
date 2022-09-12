import {isArray} from 'lodash';
import {useState, useEffect, useCallback} from 'react';
import Toast from 'react-native-toast-message';
import {Constants} from '../../../constants/Constants';
import {ToastType} from '../../../constants/ToastConstants';
import {collectionService} from '../../../services/CollectionService';
import {listService} from '../../../services/ListService';
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

    LocalEvent.on(EventTypes.ShowDeleteConfirmationModal, onShowModal);
    LocalEvent.on(EventTypes.CloseAllModals, closeModal);

    return () => {
      LocalEvent.off(EventTypes.ShowDeleteConfirmationModal, onShowModal);
      LocalEvent.off(EventTypes.CloseAllModals, closeModal);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeModal = useCallback(() => {
    setIsVisible(false);
  }, []);

  const onBackdropPress = useCallback(() => {
    closeModal();
  }, [closeModal]);

  const onSureButtonPress = useCallback(() => {
    if (modalData?.type === Constants.ConfirmDeleteModalType.List) {
      listService()
        .removeMultipleLists(modalData?.id)
        .then(() => {
          modalData?.onCollectionRemoved?.();
          Toast.show({
            type: ToastType.Success,
            text1: 'Removed lists.',
          });
        })
        .catch(() => {
          Toast.show({
            type: ToastType.Error,
            text1: 'Error in removing list.',
          });
        })
        .finally(() => {
          closeModal();
        });
    } else {
      if (isArray(modalData?.id)) {
        collectionService()
          .removeMultipleCollection(modalData?.id)
          .then(() => {
            modalData?.onCollectionRemoved?.();
            Toast.show({
              type: ToastType.Success,
              text1: 'Removed selected archives.',
            });
          })
          .catch(() => {
            Toast.show({
              type: ToastType.Error,
              text1: 'Error in removing archive.',
            });
          })
          .finally(() => {
            closeModal();
          });
      } else {
        collectionService()
          .removeCollection(modalData?.id)
          .then(() => {
            modalData?.onCollectionRemoved?.();
            Toast.show({
              type: ToastType.Success,
              text1: 'Removed archive.',
            });
          })
          .catch(() => {
            Toast.show({
              type: ToastType.Error,
              text1: 'Error in removing archive.',
            });
          })
          .finally(() => {
            closeModal();
          });
      }
    }
  }, [closeModal, modalData]);

  return {
    bIsVisible: isVisible,
    fnOnBackdropPress: onBackdropPress,
    sText:
      modalData?.text ||
      replace('Are you sure you want to remove “{{name}}” from archives?', {
        name: modalData?.name,
      }),
    sTestID: modalData?.testID,
    fnOnCancelPress: closeModal,
    fnOnSureButtonPress: onSureButtonPress,
  };
}

export default useConfirmDeleteModalData;
