import {useState, useEffect, useCallback, useRef} from 'react';
import {listService} from '../../services/ListService';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';
import Toast from 'react-native-toast-message';
import {ToastPosition, ToastType} from '../../constants/ToastConstants';

function useAddListModalData() {
  const [isVisible, setIsVisible] = useState(false);
  const listNameRef = useRef('');
  const [modalData, setModalData] = useState(null);
  const [charCount, setCharCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const _listService = listService();

  useEffect(() => {
    const onShowModal = payload => {
      setModalData(payload);
      const {id, name} = payload;
      if (id && name) {
        listNameRef.current = name;
        setCharCount(name.length);
      } else {
        setCharCount(0);
      }
      setIsVisible(true);
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

  const onCreateListPress = useCallback(() => {
    if (listNameRef.current.trim().length === 0) {
      Toast.show({
        type: ToastType.Error,
        text1: 'List name cannot be empty.',
        position: ToastPosition.Top,
      });
      return;
    }
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
  }, [_listService, closeModal, modalData]);

  const onEditListPress = useCallback(() => {
    if (listNameRef.current.trim().length === 0) {
      Toast.show({
        type: ToastType.Error,
        text1: 'List name cannot be empty.',
        position: ToastPosition.Top,
      });
      return;
    }
    if (modalData?.name === listNameRef.current) {
      closeModal?.();
      return;
    }
    _listService
      .editList({
        id: modalData?.id,
        name: listNameRef.current,
      })
      .then(() => {
        LocalEvent.emit(EventTypes.UpdateList);
        Toast.show({
          type: ToastType.Success,
          text1: 'List updated successfully',
          position: ToastPosition.Top,
        });
        closeModal();
      })
      .catch(err => {
        setErrorMessage(err);
      });
  }, [_listService, closeModal, modalData?.id, modalData?.name]);

  return {
    bIsEditMode: !!modalData?.id,
    sDefaultValue: modalData?.name,
    bIsVisible: isVisible,
    nCharacterCount: charCount,
    sErrorMessage: errorMessage,
    fnOnBackdropPress: onBackdropPress,
    fnOnListNameChange: onListNameChange,
    fnOnCreateListPress: onCreateListPress,
    fnOnEditListPress: onEditListPress,
  };
}

export default useAddListModalData;
