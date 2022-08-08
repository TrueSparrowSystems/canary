import {useState, useEffect, useCallback, useRef} from 'react';
import {listService} from '../../services/ListService';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';
import Toast from 'react-native-toast-message';
import {ToastPosition, ToastType} from '../../constants/ToastConstants';
import {replace} from '../../utils/Strings';

function useAddToListModalData() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalData, setModalData] = useState(null);
  const listRef = useRef(null);

  const getList = useCallback(() => {
    setIsLoading(true);
    listService()
      .getAllLists()
      .then(list => {
        listRef.current = JSON.parse(list);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const onShowModal = payload => {
      setModalData(payload);
      setIsVisible(true);
      getList();
    };

    LocalEvent.on(EventTypes.ShowAddToListModal, onShowModal);

    return () => {
      LocalEvent.off(EventTypes.ShowAddToListModal, onShowModal);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeModal = useCallback(() => {
    setIsVisible(false);
  }, []);

  const onBackdropPress = useCallback(() => {
    closeModal();
  }, [closeModal]);

  const showAddToListToast = useCallback(listName => {
    Toast.show({
      type: ToastType.Success,
      text1: replace('Added user to {{listName}}', {
        listName,
      }),
      position: ToastPosition.Top,
    });
  }, []);

  const onAddToListSuccess = useCallback(
    (listName, listId) => {
      showAddToListToast(listName);
      modalData?.onAddToListSuccess(listId);
    },
    [modalData, showAddToListToast],
  );

  const onAddListPress = useCallback(() => {
    setIsVisible(false);
    LocalEvent.emit(EventTypes.ShowAddListModal, {
      userName: modalData?.userName,
      onListAddSuccess: (listName, listId) => {
        showAddToListToast(listName, listId);
      },
    });
  }, [modalData?.userName, showAddToListToast]);

  return {
    bIsVisible: isVisible,
    bIsLoading: isLoading,
    sUserName: modalData?.userName || null,
    oList: listRef.current,
    fnOnBackdropPress: onBackdropPress,
    fnOnAddToListSuccess: onAddToListSuccess,
    fnOnAddListPress: onAddListPress,
    fnOnDonePress: closeModal,
  };
}

export default useAddToListModalData;
