import {useNavigation} from '@react-navigation/native';
import {useCallback, useEffect, useRef, useState} from 'react';
import Toast from 'react-native-toast-message';
import ScreenName from '../../constants/ScreenName';
import {ToastType} from '../../constants/ToastConstants';
import Cache from '../../services/Cache';
import {CacheKey} from '../../services/Cache/CacheStoreConstants';
import {listService} from '../../services/ListService';

function useListCardData(
  onListRemoved,
  userName,
  userNames,
  listId,
  listName,
  onAddToListSuccess,
  onRemoveFromListSuccess,
  shouldShowAddButton,
  onCardLongPress,
  enableSwipe,
  selectedListIds,
) {
  const navigation = useNavigation();
  const dataRef = useRef({});
  const [data, setData] = useState({});
  const [isListSelected, setIsListSelected] = useState(false);
  const onListPress = useCallback(() => {
    navigation.navigate(ScreenName.ListTweetsScreen, {
      listId,
      listName,
      listUserNames: userNames,
    });
  }, [listId, listName, navigation, userNames]);

  const viewRef = useRef();

  useEffect(() => {
    updateAddButtonData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (enableSwipe) {
      setIsListSelected(false);
    }
  }, [enableSwipe]);

  const onAddToListPress = useCallback(() => {
    listService()
      .addUserToList(listId, userName)
      .then(() => {
        updateAddButtonData();
        onAddToListSuccess(listName, listId);
      });
  }, [listId, listName, onAddToListSuccess, updateAddButtonData, userName]);

  const onRemoveFromListPress = useCallback(() => {
    listService()
      .removeUserFromList(listId, userName)
      .then(() => {
        updateAddButtonData();
        onRemoveFromListSuccess?.(listName, listId);
        //Show Remove from list toast
      });
  }, [
    listId,
    listName,
    onRemoveFromListSuccess,
    updateAddButtonData,
    userName,
  ]);

  const onListRemove = useCallback(() => {
    listService()
      .removeList(listId)
      .then(() => {
        onListRemoved();
        Toast.show({
          type: ToastType.Success,
          text1: 'Removed list.',
        });
      })
      .catch(() => {
        Toast.show({
          type: ToastType.Error,
          text1: 'Error in removing list.',
        });
      });
  }, [listId, onListRemoved]);

  const getDescriptionText = useCallback(() => {
    if (userNames.length === 0) {
      return 'includes no one yet 😢';
    } else if (userNames.length === 1) {
      return `includes @${userNames[0]}`;
    } else {
      return `includes @${userNames[0]} & ${userNames.length - 1} others`;
    }
  }, [userNames]);

  const updateAddButtonData = useCallback(() => {
    const _data = {};
    if (shouldShowAddButton) {
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
      dataRef.current = _data;
      setData({...dataRef.current});
    }
  }, [
    listId,
    onAddToListPress,
    onRemoveFromListPress,
    shouldShowAddButton,
    userName,
  ]);

  const onLongPress = useCallback(() => {
    viewRef.current.setNativeProps({
      useNativeDriver: true,
    });
    viewRef.current.animate('pulse');
    onCardLongPress();
  }, [onCardLongPress]);

  const onListSelect = useCallback(() => {
    setIsListSelected(prevVal => {
      if (prevVal) {
        selectedListIds.splice(selectedListIds.indexOf(listId), 1);
      } else {
        selectedListIds.push(listId);
      }
      return !prevVal;
    });
  }, [listId, selectedListIds]);

  return {
    bIsListSelected: isListSelected,
    viewRef: viewRef,
    fnOnListPress: onListPress,
    fnOnListRemove: onListRemove,
    fnOnListSelect: onListSelect,
    fnGetDescriptionText: getDescriptionText,
    oAddButtonData: dataRef.current,
    fnOnLongPress: onLongPress,
  };
}
export default useListCardData;
