import {useCallback, useMemo, useState} from 'react';

import PreferencesDataHelper from '../../services/PreferencesDataHelper';

export function usePreferenceSelectorData(props) {
  const {onSelectedItemsUpdate} = props;

  const originalDataArray = useMemo(() => {
    const arr = [];

    PreferencesDataHelper.getItemsArray().map(pref => {
      const data = PreferencesDataHelper.getItemData(pref);
      if (data) {
        arr.push(data);
      }
    });

    return arr;
  }, []);

  const [mainArray, setMainArray] = useState(originalDataArray);

  const [selectedPref, setSelectedPrefs] = useState(
    PreferencesDataHelper.getSelectedPreferencesListFromCache(),
  );

  const preferencesArray = useMemo(() => {
    const arr = [];

    mainArray.map(pref => {
      arr.push({...pref, isSelected: selectedPref.includes(pref.id)});
    });

    return arr;
  }, [mainArray, selectedPref]);

  const onSearchInput = useCallback(
    searchText => {
      if (searchText === '') {
        setMainArray([...originalDataArray]);
      } else {
        let filteredData = originalDataArray.filter(item => {
          return item.title.includes(searchText);
        });
        setMainArray([...filteredData]);
      }
    },
    [originalDataArray],
  );

  const onItemSelect = useCallback(
    (id, isSelected) => {
      const arr = [...selectedPref];

      if (isSelected) {
        arr.push(id);
      } else {
        arr.splice(arr.indexOf(id), 1);
      }

      onSelectedItemsUpdate?.(arr);

      setSelectedPrefs([...arr]);
    },
    [onSelectedItemsUpdate, selectedPref],
  );

  return {
    aPreferences: preferencesArray,
    fnOnItemSelect: onItemSelect,
    fnOnSearchInput: onSearchInput,
  };
}
