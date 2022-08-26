import {isArray} from 'lodash';
import {useCallback, useEffect, useRef, useState} from 'react';
import ScreenName from '../../constants/ScreenName';
import {listService} from '../../services/ListService';
import NavigationService from '../../services/NavigationService';

const useImportListScreenData = data => {
  const [selectedIndex, setSelectedIndex] = useState(0);
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

  const onImportPress = useCallback(() => {}, []);

  return {
    aData: listsDataRef.current,
    nSelectedIndex: selectedIndex,
    fnUpdateSelectedIndex: setSelectedIndex,
    fnOnListMemberRemove: onListMemberRemove,
    fnOnListRemove: onListRemove,
    fnNavigateToHomescreen: navigateToHomescreen,
  };
};

export default useImportListScreenData;
