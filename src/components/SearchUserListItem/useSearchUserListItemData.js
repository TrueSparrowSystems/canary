import {useCallback, useEffect, useState} from 'react';
import Cache from '../../services/Cache';
import {CacheKey} from '../../services/Cache/CacheStoreConstants';
import {listService} from '../../services/ListService';

function useSearchUserListItemData(props) {
  const {listId, userName} = props;
  const [data, setData] = useState({});

  useEffect(() => {
    updateAddButtonData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onAddToListPress = useCallback(() => {
    listService()
      .addUserToList(listId, userName)
      .then(() => {
        updateAddButtonData();
      });
  }, [listId, updateAddButtonData, userName]);

  const onRemoveFromListPress = useCallback(() => {
    listService()
      .removeUserFromList(listId, userName)
      .then(() => {
        updateAddButtonData();
      });
  }, [listId, updateAddButtonData, userName]);

  const updateAddButtonData = useCallback(() => {
    const _data = {};

    const userToListMap = Cache.getValue(CacheKey.UserToListMap);
    const listIdArray = userToListMap?.[userName];
    if (listIdArray?.includes(listId)) {
      _data.buttonText = '✓ Added';
      _data.buttonType = 'Secondary';
      _data.onPress = onRemoveFromListPress;
    } else {
      _data.buttonText = 'Add';
      _data.buttonType = 'Primary';
      _data.onPress = onAddToListPress;
    }
    setData({..._data});
  }, [listId, onAddToListPress, onRemoveFromListPress, userName]);

  return {
    oAddButtonData: data,
  };
}

export default useSearchUserListItemData;
