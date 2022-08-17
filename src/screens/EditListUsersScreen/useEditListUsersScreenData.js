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
          const apiRes = res?.data?.data;
          apiRes.sort(function compare(user1, user2) {
            if (user1.name > user2.name) {
              return 1;
            } else if (user1.name < user2.name) {
              return -1;
            }
            return 0;
          });
          const errors = res?.data?.errors;
          errors?.forEach(error => {
            if (
              error.title === 'Not Found Error' &&
              error.parameter === 'usernames'
            ) {
              apiRes.push({
                blocked: true,
                username: error.value,
              });
            }
          });
          listMembersRef.current = apiRes;
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

  const onRefresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    bIsLoading: isLoading,
    aListMembers: listMembersRef.current,
    fnOnMemberRemove: onMemberRemove,
    fnOnRefresh: onRefresh,
  };
}

export default useEditListUsersScreenData;
