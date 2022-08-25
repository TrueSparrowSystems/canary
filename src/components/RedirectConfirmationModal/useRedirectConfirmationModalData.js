import {useState, useEffect, useCallback} from 'react';
import {Linking} from 'react-native';
import AsyncStorage from '../../services/AsyncStorage';
import {StoreKeys} from '../../services/AsyncStorage/StoreConstants';
import Cache from '../../services/Cache';
import {CacheKey} from '../../services/Cache/CacheStoreConstants';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';

function useRedirectConfirmationModalData() {
  const [isVisible, setIsVisible] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [checkboxValue, setCheckboxValue] = useState(false);

  useEffect(() => {
    const onShowModal = payload => {
      setModalData(payload);
      setIsVisible(true);
    };

    LocalEvent.on(EventTypes.ShowRedirectConfirmationModal, onShowModal);

    return () => {
      LocalEvent.off(EventTypes.ShowRedirectConfirmationModal, onShowModal);
    };
  });

  const closeModal = useCallback(() => {
    setIsVisible(false);
  }, []);

  const onBackdropPress = useCallback(() => {
    closeModal();
  }, [closeModal]);

  const onCheckboxValueChange = useCallback(value => {
    setCheckboxValue(value);
  }, []);

  const onSureButtonPress = useCallback(() => {
    Linking.openURL(modalData?.tweetUrl);
    AsyncStorage.set(StoreKeys.IsRedirectModalHidden, checkboxValue).then(
      () => {
        Cache.setValue(CacheKey.IsRedirectModalHidden, checkboxValue);
      },
    );
    closeModal();
  }, [checkboxValue, closeModal, modalData?.tweetUrl]);

  return {
    bIsVisible: isVisible,
    fnOnBackdropPress: onBackdropPress,
    fnOnCancelPress: closeModal,
    fnOnSureButtonPress: onSureButtonPress,
    fnOnCheckboxValueChange: onCheckboxValueChange,
  };
}

export default useRedirectConfirmationModalData;
