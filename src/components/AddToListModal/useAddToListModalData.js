import {useState, useEffect, useCallback, useRef} from 'react';
import {listService} from '../../services/ListService';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';
import Toast from 'react-native-toast-message';
import {ToastPosition, ToastType} from '../../constants/ToastConstants';
import {compareFunction, replace} from '../../utils/Strings';
import Cache from '../../services/Cache';
import {CacheKey} from '../../services/Cache/CacheStoreConstants';
import TwitterAPI from '../../api/helpers/TwitterAPI';

function useAddToListModalData() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef({});
  const userDataRef = useRef({});
  const [userData, setUserData] = useState(userDataRef.current);
  const listRef = useRef(null);

  const getList = useCallback(() => {
    setIsLoading(true);
    TwitterAPI.getUserByUserName(modalRef.current?.userName).then(res => {
      userDataRef.current = res?.data?.data;
      setUserData(userDataRef.current);
    });
    listService()
      .getAllLists()
      .then(list => {
        const listArray = Object.entries(list);
        const userToListMap = Cache.getValue(CacheKey.UserToListMap);
        const listIdArray = userToListMap?.[modalRef.current?.userName] || [];

        listArray.sort(function compare(list1, list2) {
          if (
            listIdArray?.includes(list1[1].id) &&
            listIdArray?.includes(list2[1].id)
          ) {
            // if user is present in both lists
            return compareFunction(list1[1].name, list2[1].name);
          } else if (listIdArray.includes(list1[1].id)) {
            // if user is present in list1
            return -1;
          } else if (listIdArray.includes(list2[1].id)) {
            // if user is present in list2
            return 1;
          }

          // if user is not present in any list
          return compareFunction(list1[1].name, list2[1].name);
        });
        listRef.current = Object.fromEntries(listArray);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const onShowModal = payload => {
      modalRef.current = payload;
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
    userDataRef.current = {};
    setUserData(userDataRef.current);
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
      modalRef.current?.onAddToListSuccess(listId);
    },
    [showAddToListToast],
  );

  const onAddListPress = useCallback(() => {
    setIsVisible(false);
    LocalEvent.emit(EventTypes.ShowAddListModal, {
      userName: modalRef.current?.userName,
      onListAddSuccess: (listName, listId) => {
        getList();
        setIsVisible(true);
        showAddToListToast(listName, listId);
      },
    });
  }, [getList, showAddToListToast]);

  return {
    bIsVisible: isVisible,
    bIsLoading: isLoading,
    sUserName: modalRef.current?.userName || null,
    oList: listRef.current,
    oUserData: userDataRef.current,
    fnOnBackdropPress: onBackdropPress,
    fnOnAddToListSuccess: onAddToListSuccess,
    fnOnAddListPress: onAddListPress,
    fnOnDonePress: closeModal,
  };
}

export default useAddToListModalData;
