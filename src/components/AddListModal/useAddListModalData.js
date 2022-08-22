import {useState, useEffect, useCallback, useRef} from 'react';
import {listService} from '../../services/ListService';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';
import Toast from 'react-native-toast-message';
import {ToastPosition, ToastType} from '../../constants/ToastConstants';

function useAddListModalData() {
  const [isVisible, setIsVisible] = useState(false);
  const listNameRef = useRef('');
  const importListTextRef = useRef('');
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

    LocalEvent.on(EventTypes.ShowAddListModal, onShowModal);

    return () => {
      LocalEvent.off(EventTypes.ShowAddListModal, onShowModal);
    };
  });

  const closeModal = useCallback(() => {
    listNameRef.current = '';

    setIsVisible(false);
  }, []);

  const onBackdropPress = useCallback(() => {
    closeModal();
  }, [closeModal]);

  const onListNameChange = useCallback(newValue => {
    listNameRef.current = newValue;
    setCharCount(newValue?.length || 0);
  }, []);

  const onImportListTextChange = useCallback(newValue => {
    importListTextRef.current = newValue;
  }, []);

  const onCreateListPress = useCallback(() => {
    if (listNameRef.current.trim().length === 0) {
      Toast.show({
        type: ToastType.Error,
        text1: 'List name cannot be empty.',
        position: ToastPosition.Top,
      });
      return;
    }
    const _listService = listService();
    _listService
      .addList(listNameRef.current)
      .then(({listId}) => {
        Toast.show({
          type: ToastType.Success,
          text1: 'List created successfully.',
          position: ToastPosition.Top,
        });
        if (modalData?.userName) {
          _listService
            .addUserToList(listId, modalData.userName)
            .then(() => {
              LocalEvent.emit(EventTypes.UpdateList);
              modalData?.onListAddSuccess(listNameRef.current, listId);
              closeModal();
            })
            .catch(() => {});
        } else {
          modalData?.onListAddSuccess();
          closeModal();
        }
      })
      .catch(err => {
        listNameRef.current = '';

        Toast.show({
          type: ToastType.Error,
          text1: 'List could not be created. Please try again',
          position: ToastPosition.Top,
        });
        setErrorMessage(err);
      })
      .finally(() => {
        _listService.getAllLists();
      });
  }, [closeModal, modalData]);

  const onImportListPress = useCallback(() => {
    if (importListTextRef.current.trim().length === 0) {
      Toast.show({
        type: ToastType.Error,
        text1: 'Import URL cannot be empty.',
        position: ToastPosition.Top,
      });
      return;
    }
    const _listService = listService();
    _listService
      .importList(importListTextRef.current)
      .then(({listId}) => {
        Toast.show({
          type: ToastType.Success,
          text1: 'List imported successfully.',
          position: ToastPosition.Top,
        });
        if (modalData?.userName) {
          _listService
            .addUserToList(listId, modalData.userName)
            .then(() => {
              LocalEvent.emit(EventTypes.UpdateList);
              modalData?.onListAddSuccess(importListTextRef.current, listId);
              closeModal();
            })
            .catch(() => {});
        } else {
          modalData?.onListAddSuccess();
          closeModal();
        }
      })
      .catch(err => {
        importListTextRef.current = '';

        Toast.show({
          type: ToastType.Error,
          text1: 'List could not be imported. Please try again',
          position: ToastPosition.Top,
        });
        setErrorMessage(err);
      })
      .finally(() => {
        _listService.getAllLists();
      });
  }, [closeModal, modalData]);

  return {
    bIsVisible: isVisible,
    nCharacterCount: charCount,
    sErrorMessage: errorMessage,
    fnOnBackdropPress: onBackdropPress,
    fnOnListNameChange: onListNameChange,
    fnOnImportListTextChange: onImportListTextChange,
    fnOnCreateListPress: onCreateListPress,
    fnOnImportListPress: onImportListPress,
  };
}

export default useAddListModalData;
