import {useCallback, useEffect, useRef, useState} from 'react';
import TwitterAPI from '../../api/helpers/TwitterAPI';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';

const useSearchUserModalData = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalData, setModalData] = useState({});
  const userData = useRef([]);
  const searchQuery = useRef('');

  const onSearchPress = useCallback(
    newQuery => {
      searchQuery.current = newQuery.toLowerCase();
      setIsLoading(true);

      fetchData();
    },
    [fetchData],
  );

  const fetchData = useCallback(() => {
    TwitterAPI.searchUser(searchQuery.current)
      .then(res => {
        const {data} = res;

        userData.current = data;
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const onShowModal = payload => {
      if (payload) {
        setModalData(payload);
      }
      searchQuery.current = '';
      setIsLoading(false);
      setIsVisible(true);
    };
    LocalEvent.on(EventTypes.ShowSearchUserModal, onShowModal);
    return () => {
      LocalEvent.off(EventTypes.ShowSearchUserModal, onShowModal);
    };
  });

  const closeModal = useCallback(() => {
    LocalEvent.emit(EventTypes.UpdateList);
    modalData?.onUserAddComplete?.();
    setTimeout(() => {
      setIsVisible(false);
    }, 200);
  }, [modalData]);

  return {
    bIsVisible: isVisible,
    bIsLoading: isLoading,
    bIsSearchBarEmpty: searchQuery.current.length === 0,
    aUserData: userData.current,
    oModalData: modalData,
    fnCloseModal: closeModal,
    fnOnSearchPress: onSearchPress,
  };
};

export default useSearchUserModalData;
