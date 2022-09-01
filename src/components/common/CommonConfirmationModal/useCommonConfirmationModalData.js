import {useState, useEffect, useCallback} from 'react';
import {EventTypes, LocalEvent} from '../../../utils/LocalEvent';

function useCommonConfirmationModalData() {
  const [isVisible, setIsVisible] = useState(false);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    const onShowModal = payload => {
      setModalData(payload);
      setIsVisible(true);
    };

    LocalEvent.on(EventTypes.ShowCommonConfirmationModal, onShowModal);

    return () => {
      LocalEvent.off(EventTypes.ShowCommonConfirmationModal, onShowModal);
    };
  });

  const closeModal = useCallback(() => {
    setIsVisible(false);
  }, []);

  const onBackdropPress = useCallback(() => {
    closeModal();
  }, [closeModal]);

  const onSureButtonPress = useCallback(() => {
    modalData?.onSureButtonPress?.();
    closeModal?.();
  }, [closeModal, modalData]);

  return {
    bIsVisible: isVisible,
    sTestID: modalData?.testID,
    fnOnBackdropPress: onBackdropPress,
    sHeaderText: modalData?.headerText,
    sPrimaryText: modalData?.primaryText,
    sSecondaryText: modalData?.secondaryText,
    fnOnCancelPress: closeModal,
    fnOnSureButtonPress: onSureButtonPress,
  };
}

export default useCommonConfirmationModalData;
