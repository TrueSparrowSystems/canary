import {useCallback, useEffect, useRef, useState} from 'react';
import TwitterAPI from '../../api/helpers/TwitterAPI';
import {ToastPosition, ToastType} from '../../constants/ToastConstants';
import {listService} from '../../services/ListService';
import Toast from 'react-native-toast-message';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';

function useEditListUsersScreenData(listId) {
  let listMembersRef = useRef([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUserNameArray = useCallback(() => {
    return new Promise(resolve => {
      listService()
        .getListDetails(listId)
        .then(res => {
          return resolve(res?.userNames);
        });
    });
  }, [listId]);

  const fetchData = useCallback(() => {
    setIsLoading(true);

    getUserNameArray().then(userNames => {
      const userNamesString = userNames.join(',');
      listMembersRef.current = [];
      TwitterAPI.getUsersByUserNames(userNamesString)
        .then(res => {
          listMembersRef.current = res.data.data;
        })
        .catch(() => {
          //TODO: handle Error
        })
        .finally(() => {
          setIsLoading(false);
        });
    });
  }, [getUserNameArray]);

  const onMemberRemove = useCallback(
    userName => {
      listService()
        .removeUserFromList(listId, userName)
        .then(() => {
          Toast.show({
            type: ToastType.Success,
            text1: `${userName} removed from list`,
            position: ToastPosition.Top,
          });
          LocalEvent.emit(EventTypes.UpdateList);
          fetchData();
        })
        .catch(err => {
          Toast.show({
            type: ToastType.Error,
            text1: err,
            position: ToastPosition.Top,
          });
        });
    },
    [fetchData, listId],
  );

  return {
    bIsLoading: isLoading,
    aListMembers: listMembersRef.current,
    fnOnMemberRemove: onMemberRemove,
  };
}

export default useEditListUsersScreenData;
