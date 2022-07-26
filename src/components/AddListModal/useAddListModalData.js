import {useState, useEffect, useCallback, useRef} from 'react';
import {listService} from '../../services/ListService';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';
import Toast from 'react-native-toast-message';
import {ToastPosition, ToastType} from '../../constants/ToastConstants';

function useAddListModalData() {
  const [isVisible, setIsVisible] = useState(false);
  const listNameRef = useRef('');
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    const onShowModal = payload => {
      setModalData(payload);
      setIsVisible(true);
    };

    LocalEvent.on(EventTypes.ShowAddListModal, onShowModal);

    return () => {
      LocalEvent.off(EventTypes.ShowAddListModal, onShowModal);
    };
  });

  const closeModal = useCallback(() => {
    setIsVisible(false);
  }, []);

  const onBackdropPress = useCallback(() => {
    closeModal();
  }, [closeModal]);

  const onListNameChange = useCallback(newValue => {
    listNameRef.current = newValue;
  }, []);

  const onCreateListPress = useCallback(() => {
    if (listNameRef.current.length === 0) {
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
          LocalEvent.emit(EventTypes.UpdateList);
          _listService.addUserToList(listId, modalData.userName).then(() => {
            closeModal();
            modalData?.onListAddSuccess(listNameRef.current, listId);
          });
        } else {
          closeModal();
          modalData?.onListAddSuccess();
        }
      })
      .catch(() => {
        Toast.show({
          type: ToastType.Error,
          text1: 'List could not be created. Please try again',
          position: ToastPosition.Top,
        });
      })
      .finally(() => {
        _listService.getAllLists();
      });
  }, [closeModal, modalData]);

  return {
    bIsVisible: isVisible,
    fnOnBackdropPress: onBackdropPress,
    fnOnListNameChange: onListNameChange,
    fnOnCreateListPress: onCreateListPress,
  };
}

export default useAddListModalData;
