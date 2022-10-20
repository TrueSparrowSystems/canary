import {isArray, isEmpty} from 'lodash';
import {useCallback, useEffect, useRef, useState} from 'react';
import TwitterAPI from '../../../api/helpers/TwitterAPI';

const useEditUserListData = props => {
  const {userNames = []} = props;

  const listMembersRef = useRef([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(userNames)]);

  const fetchData = useCallback(() => {
    setIsLoading(true);

    listMembersRef.current = [];
    if (isArray(userNames) && !isEmpty(userNames)) {
      const userNamesString = userNames.join(',');
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
    } else {
      setIsLoading(false);
    }
  }, [userNames]);

  const onRefresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    bIsLoading: isLoading,
    aListMembers: listMembersRef.current,
    fnOnRefresh: onRefresh,
  };
};

export default useEditUserListData;
