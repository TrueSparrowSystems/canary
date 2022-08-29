import {isArray} from 'lodash';
import {useCallback, useRef, useState} from 'react';
import ScreenName from '../../constants/ScreenName';
import {ToastPosition, ToastType} from '../../constants/ToastConstants';
import {listService} from '../../services/ListService';
import NavigationService from '../../services/NavigationService';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';
import Toast from 'react-native-toast-message';

const useImportListScreenData = data => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const isImportingInProgressRef = useRef(false);
  const listsDataRef = useRef([...data]);
  const [listDataState, setListDataState] = useState(listsDataRef.current);

  const onListMemberRemove = useCallback(
    username => {
      const currentListUsernameData =
        listsDataRef.current[selectedIndex]?.userNames;
      if (isArray(currentListUsernameData)) {
        const selectedUserIndex = currentListUsernameData?.indexOf(username);
        currentListUsernameData?.splice(selectedUserIndex, 1);
        setListDataState([...listsDataRef.current]);
      }
    },
    [selectedIndex],
  );
  const onListRemove = useCallback(index => {
    if (index < listsDataRef.current.length && index >= 0) {
      listsDataRef.current.splice(index, 1);
      setListDataState([...listsDataRef.current]);
    }
  }, []);

  const navigateToHomescreen = useCallback(() => {
    NavigationService.navigate(ScreenName.TimelineScreen);
  }, []);

  const onImportPress = useCallback(() => {
    if (isImportingInProgressRef.current) {
      return;
    }
    isImportingInProgressRef.current = true;
    LocalEvent.emit(EventTypes.CommonLoader.Show);
    listService()
      .importMultipleLists(listsDataRef.current)
      .then(() => {
        LocalEvent.emit(EventTypes.CommonLoader.Hide);
        LocalEvent.emit(EventTypes.UpdateList);
        Toast.show({
          type: ToastType.Success,
          text1: 'List import successful.',
          position: ToastPosition.Top,
        });
      })
      .catch(err => {
        LocalEvent.emit(EventTypes.CommonLoader.Hide);
        Toast.show({
          type: ToastType.Error,
          text1: err,
          position: ToastPosition.Top,
        });
      })
      .finally(() => {
        LocalEvent.emit(EventTypes.CommonLoader.Hide);
        NavigationService.navigate(ScreenName.ListScreen);
        isImportingInProgressRef.current = false;
      });
  }, []);

  return {
    aData: listsDataRef.current,
    nSelectedIndex: selectedIndex,
    fnUpdateSelectedIndex: setSelectedIndex,
    fnOnListMemberRemove: onListMemberRemove,
    fnOnListRemove: onListRemove,
    fnNavigateToHomescreen: navigateToHomescreen,
    fnOnImportPress: onImportPress,
  };
};

export default useImportListScreenData;
