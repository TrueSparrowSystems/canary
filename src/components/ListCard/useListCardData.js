import {useNavigation} from '@react-navigation/native';
import {useCallback, useEffect, useRef, useState} from 'react';
import {Share} from 'react-native';
import {Constants} from '../../constants/Constants';
import ScreenName from '../../constants/ScreenName';
import Cache from '../../services/Cache';
import {CacheKey} from '../../services/Cache/CacheStoreConstants';
import {listService} from '../../services/ListService';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';

function useListCardData(props) {
  const {
    data: propsData,
    enableSwipe,
    shouldShowAddButton,
    userName,
    onAddToListSuccess,
    onRemoveFromListSuccess,
    selectedListIds,
  } = props;
  const {id: listId, name: listName, userNames} = propsData;

  const [data, setData] = useState({});
  const [isListSelected, setIsListSelected] = useState(false);
  const [isPopOverVisible, setIsPopOverVisible] = useState(false);

  const dataRef = useRef({});
  const viewRef = useRef(null);

  const navigation = useNavigation();

  const _listService = listService();

  const onListPress = useCallback(() => {
    navigation.navigate(ScreenName.ListTweetsScreen, {
      listId,
      listName,
      listUserNames: userNames,
    });
  }, [listId, listName, navigation, userNames]);

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
    _listService.addUserToList(listId, userName).then(() => {
      updateAddButtonData();
      onAddToListSuccess(listName, listId);
    });
  }, [
    _listService,
    listId,
    listName,
    onAddToListSuccess,
    updateAddButtonData,
    userName,
  ]);

  const onRemoveFromListPress = useCallback(() => {
    _listService.removeUserFromList(listId, userName).then(() => {
      updateAddButtonData();
      onRemoveFromListSuccess?.(listName, listId);
      //Show Remove from list toast
    });
  }, [
    _listService,
    listId,
    listName,
    onRemoveFromListSuccess,
    updateAddButtonData,
    userName,
  ]);

  const onListRemove = useCallback(() => {
    hidePopover();
    LocalEvent.emit(EventTypes.ShowDeleteConfirmationModal, {
      id: listId,
      name: listName,
      onCollectionRemoved: () => {},
      type: Constants.ConfirmDeleteModalType.List,
      testID: 'remove_list',
    });
  }, [hidePopover, listId, listName]);

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
    showPopover();
  }, [showPopover]);

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

  const showPopover = useCallback(() => {
    setIsPopOverVisible(true);
  }, []);

  const hidePopover = useCallback(() => {
    setIsPopOverVisible(false);
  }, []);

  const onRemovePress = useCallback(() => {
    hidePopover();

    onListRemove();
  }, [hidePopover, onListRemove]);

  const onEditPress = useCallback(() => {
    hidePopover();

    LocalEvent.emit(EventTypes.ShowAddListModal, {
      name: listName,
      id: listId,
    });
  }, [hidePopover, listId, listName]);

  const onShareListPress = useCallback(() => {
    _listService
      .exportList([listId])
      .then(res => {
        Share.share({message: res});
      })
      .catch(() => {});
  }, [_listService, listId]);

  return {
    bIsListSelected: isListSelected,
    oViewRef: viewRef,
    bIsPopOverVisible: isPopOverVisible,
    oAddButtonData: dataRef.current,
    fnHidePopover: hidePopover,
    fnOnListPress: onListPress,
    fnOnRemovePress: onRemovePress,
    fnOnListSelect: onListSelect,
    fnGetDescriptionText: getDescriptionText,
    fnOnLongPress: onLongPress,
    fnOnEditPress: onEditPress,
    fnOnShareListPress: onShareListPress,
  };
}
export default useListCardData;
