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

  const [selectedPref, setSelectedPrefs] = useState(
    PreferencesDataHelper.getSelectedPreferencesListFromCache(),
  );

  const preferencesArray = useMemo(() => {
    const arr = [];

    originalDataArray.map(pref => {
      arr.push({...pref, isSelected: selectedPref.includes(pref.id)});
    });

    return arr;
  }, [originalDataArray, selectedPref]);

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
  };
}
