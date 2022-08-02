import {useNavigation} from '@react-navigation/native';
import {useCallback, useMemo, useState} from 'react';
import Cache from '../../services/Cache';
import {CacheKey} from '../../services/Cache/CacheStoreConstants';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';

const useLocationSelectionScreenData = () => {
  const originalDataArray = useMemo(() => {
    const data = Cache.getValue(CacheKey.AvailableWoeidsList) || [];
    return Object.keys(data);
  }, []);

  const navigation = useNavigation();

  const [mainArray, setMainArray] = useState(originalDataArray);

  const onSearchInput = useCallback(
    searchText => {
      if (searchText === '') {
        setMainArray([...originalDataArray]);
      } else {
        let filteredData = originalDataArray.filter(item => {
          return item.includes(searchText);
        });

        setMainArray([...filteredData]);
      }
    },
    [originalDataArray],
  );

  const onItemSelect = useCallback(
    countryName => {
      Cache.setValue(CacheKey.SelectedLocation, countryName);
      LocalEvent.emit(EventTypes.LocationSelectionChanged);
      navigation.goBack();
    },
    [navigation],
  );

  return {
    aData: mainArray,
    fnOnSearchInput: onSearchInput,
    fnOnItemSelect: onItemSelect,
  };
};

export default useLocationSelectionScreenData;
