import {useCallback, useMemo, useState} from 'react';
import {PreferencesData} from '../../constants/PreferencesData';

export function usePreferenceSelectorData(props) {
  const originalDataArray = useMemo(() => {
    const arr = [];

    PreferencesData.items.map(pref => {
      const data = PreferencesData.data?.[pref];
      if (data) {
        arr.push(data);
      }
    });

    return arr;
  }, []);

  const [mainArray, setMainArray] = useState(originalDataArray);

  const [selectedPref, setSelectedPrefs] = useState([]);

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

  const onItemSelect = useCallback((id, isSelected) => {
    if (isSelected) {
      setSelectedPrefs(prevPrefs => {
        prevPrefs.push(id);
        return [...prevPrefs];
      });
    } else {
      setSelectedPrefs(prevPrefs => {
        prevPrefs.splice(prevPrefs.indexOf(id), 1);
        return [...prevPrefs];
      });
    }
  }, []);

  return {
    aPreferences: preferencesArray,
    fnOnItemSelect: onItemSelect,
    fnOnSearchInput: onSearchInput,
  };
}
